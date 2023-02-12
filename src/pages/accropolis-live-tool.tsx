import React, { useState, useEffect } from "react"
import { fetchQuery } from "utils/utils"
import { getDeputesAccropolis, getMinistres } from "../lib/deputes/Wrapper"
import Controls from "components/accropolis/Controls"
import { useRouter } from "next/router"
import controlsStyles from "components/accropolis/ControlsStyles.module.scss"
import deputeBannerStyles from "components/accropolis/DeputeBannerStyles.module.scss"
import { gsap } from "gsap"
import mapStore from "src/stores/mapStore"
import jsonwebtoken from "jsonwebtoken"
import DeputeBanner from "src/components/accropolis/DeputeBanner"
// import accropolisStore from "src/stores/accropolisStore";

import { Auth } from "@supabase/ui"
import supabase from "../lib/supabase/client"

// Constantes
/*----------------------------------------------------*/
const LogoTwitch = ({ size = 24 }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} x="0" y="0" viewBox="0 0 512 512">
      <g xmlns="http://www.w3.org/2000/svg">
        <g>
          <path
            d="M48,0L16,96v352h128v64h64l64-64h96l128-136.32V0H48z M464,288l-89.6,96H260.928L192,434.144V384H80V32h384V288z"
            fill="#ffffff"
            data-original="#000000"
          />
        </g>
      </g>
      <g xmlns="http://www.w3.org/2000/svg">
        <g>
          <rect x="240" y="128" width="32" height="128" fill="#ffffff" data-original="#000000" />
        </g>
      </g>
      <g xmlns="http://www.w3.org/2000/svg">
        <g>
          <rect x="336" y="128" width="32" height="128" fill="#ffffff" data-original="#000000" />
        </g>
      </g>
    </svg>
  )
}

// Component
/*----------------------------------------------------*/
export default function AccropolisLiveTools({ allAccroDeputes, allMinistres }) {
  // Core component states
  const { session } = Auth.useUser()
  const [loading, setLoading] = useState(false)
  const [debug, setDebug] = useState("")

  // Banner states
  const [activeDepute, setActiveDepute] = useState(null)
  const [bannerState, setBannerState] = useState("intro")
  const [currentAnimation, setCurrentAnimation] = useState({
    animation: null,
    type: null,
  })
  const [question, setQuestion] = useState("")
  const [overview, setOverview] = useState(false)
  const [mapOpacity, setMapOpacity] = useState({ value: 0 })
  const refMapOpacity = { value: 1 }

  // Animations
  /*----------------------------------------------------*/
  const olderBannerAnimation = (setCurrentAnimation) => {
    // Timeline
    const olderTL = gsap.timeline({
      onComplete: () => {
        setCurrentAnimation({
          animation: null,
          type: null,
        })
      },
    })
    olderTL.addLabel("olderTL")
    olderTL.call(() => {
      setCurrentAnimation({
        animation: olderTL,
        type: "older",
      })
    })

    // olderTL.to(`.${deputeBannerStyles.deputeBanner__questionInner}`, {
    //   x: '-100%',
    //   ease: 'power1.in',
    //   duration: 0.5,
    // })
    // olderTL.to(`.${deputeBannerStyles.deputeBanner__topBackground}`, {
    //   scaleX: 0,
    //   ease: 'power1.in',
    // })
    // olderTL.to(`.${deputeBannerStyles.deputeBanner__questionNumber}`, {
    //   x: '100%',
    //   ease: 'power1.in',
    // })
    olderTL.to(
      `.${deputeBannerStyles.deputeBanner__content} > *`,
      {
        x: "-100%",
        autoAlpha: 0,
        ease: "power1.in",
      },
      "-=0.3"
    )
    olderTL.to(
      `.${deputeBannerStyles.deputeBanner__logoGroup}`,
      {
        x: "-100px",
        autoAlpha: 0,
        ease: "power1.in",
      },
      "-=0.3"
    )
    olderTL.to(
      `.${deputeBannerStyles.deputeBanner__mapHeader}`,
      {
        height: 0,
        ease: "power1.in",
      },
      "-=0.6"
    )
    olderTL.to(refMapOpacity, {
      value: 0,
      duration: 0.2,
      onUpdate: () => {
        setMapOpacity({ value: refMapOpacity.value })
      },
    })
    return olderTL
  }

  const cycleBannerContent = (event, people) => {
    if (event) {
      event.preventDefault()
    }
    console.log({ people })
    if (people.type === "dep") {
      supabase
        .from("Session")
        .update({ Depute: people.Slug, BannerState: people.type })
        .match({ id: "1234" })
        .then((r) => console.log("Depute sent", r))
    } else {
      supabase
        .from("Session")
        .update({ Ministre: people.Slug, BannerState: people.type })
        .match({ id: "1234" })
        .then((r) => console.log("Ministre sent", r))
    }
    setBannerState(people.type)
    setActiveDepute(people)
    if (currentAnimation.animation) {
      currentAnimation.animation.kill()
      if (currentAnimation.type === "older") {
        // socket.emit("depute_write", people)
        // socket.emit("overview", overview)
        return
      }
    }

    // After timeline
    const olderTL = olderBannerAnimation(setCurrentAnimation)
    olderTL.call(
      () => {
        // socket.emit("depute_write", people)
        // socket.emit("overview", overview)
      },
      [],
      "+=0.2"
    )
    olderTL.play()
  }

  return (
    <div
      className={`accropolis-live-tool${session ? " logged" : " not-logged"}${session ? " authorized" : " not-authorized"}${
        session && loading ? " loading" : ""
      }`}
    >
      {!session ? (
        <div className="accropolis__login">
          <h2>Vous n'êtes pas connecté</h2>
          <a
            className="accropolis__login-btn"
            onClick={() =>
              supabase.auth.signIn(
                {
                  provider: "twitch",
                },
                {
                  redirectTo: "http://localhost:3000/accropolis-live-tool",
                }
              )
            }
          >
            <p>Se connecter avec twitch</p>
            <LogoTwitch />
          </a>
        </div>
      ) : session && loading ? (
        <>
          <div className="accropolis__login">
            <LogoTwitch size={150} />
            <div className="login__content">
              <p>Bienvenue {session.user.user_metadata.slug}, vous êtes connecté!</p>
              <button
                className="accropolis__logout-btn"
                onClick={() => {
                  supabase.auth.signOut()
                }}
              >
                Déconnecter
              </button>
            </div>
          </div>
          <div className="lds-dual-ring">{/* Empty */}</div>
        </>
      ) : (
        <>
          <div className="accropolis__login">
            <LogoTwitch size={150} />
            <div className="login__content">
              <p>Bienvenue {session.user.user_metadata.slug}, vous êtes connecté!</p>
              <button
                className="accropolis__logout-btn"
                onClick={() => {
                  supabase.auth.signOut()
                }}
              >
                Déconnecter
              </button>
            </div>
          </div>
          <div className="accropolis-live-tool__preview">
            <h2>Aperçu live</h2>
            <div className="controls__affichage">
              <button className={`${controlsStyles.btn} ${!debug ? controlsStyles.btnActive : ""}`} onClick={() => setDebug("")}>
                OBS
              </button>
              <button
                className={`${controlsStyles.btn} ${debug === "small" ? controlsStyles.btnActive : ""}`}
                onClick={() => setDebug("small")}
              >
                Petit
              </button>
              <button
                className={`${controlsStyles.btn} ${debug === "full" ? controlsStyles.btnActive : ""}`}
                onClick={() => setDebug("full")}
              >
                Plein
              </button>
            </div>
            {(bannerState === "dep" || bannerState === "gov") && activeDepute ? (
              <DeputeBanner
                debug={debug}
                bannerState={bannerState}
                depute={activeDepute}
                currentAnimation={currentAnimation}
                setCurrentAnimation={setCurrentAnimation}
                mapOpacity={mapOpacity}
                setMapOpacity={setMapOpacity}
                question={question}
                overview={overview}
              />
            ) : null}
          </div>
          <div className="accropolis-live-tool__content">
            <Controls
              // socket={socket}
              question={question}
              setQuestion={setQuestion}
              overview={overview}
              setOverview={setOverview}
              deputes={allAccroDeputes}
              activeDepute={activeDepute}
              cycleBannerContent={cycleBannerContent}
              currentAnimation={currentAnimation}
              setCurrentAnimation={setCurrentAnimation}
              olderBannerAnimation={olderBannerAnimation}
              government={allMinistres}
              bannerState={bannerState}
              setBannerState={setBannerState}
            />
          </div>
        </>
      )}
    </div>
  )
}

async function getServerSideProps() {
  const allAccroDeputes = await getDeputesAccropolis()
  const allMinistres = await getMinistres()

  return {
    props: {
      title: "Live Tool",
      allAccroDeputes,
      allMinistres,
    },
  }
}

export { getServerSideProps }
