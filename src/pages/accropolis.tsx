import React, { useState, useEffect } from "react"
import DeputeBanner from "components/accropolis/DeputeBanner"
import deputeBannerStyles from "components/accropolis/DeputeBannerStyles.module.scss"
import { gsap } from "gsap"
import mapStore from "src/stores/mapStore"
import { Auth } from "@supabase/ui"
import supabaseClient from "lib/supabase/client"

function handleSupabaseError({ error, ...rest }) {
  if (error) {
    throw error
  }
  return rest
}

export default function Accropolis({ session }) {
  const [currentAnimation, setCurrentAnimation] = useState({
    animation: null,
    type: null,
  })
  const [question, setQuestion] = useState(session.Question)
  const [mapOpacity, setMapOpacity] = useState({ value: 0 })
  const [activeDepute, setActiveDepute] = useState(session.Depute)
  const [bannerState, setBannerState] = useState(session.BannerState)
  const [overview, setOverview] = useState(session.Overview)

  const refMapOpacity = { value: 1 }
  // Realtime client
  useEffect(() => {
    var subscription = supabaseClient
      .from("Session:id=eq.1234")
      .on("UPDATE", async (payload) => {
        console.log("Update received", { payload })
        if (payload.new.BannerState === "dep") {
          const { data, error } = await supabaseClient
            .from("Depute")
            .select(
              `
                *,
                GroupeParlementaire (
                  *
                )
              `
            )
            .eq("Slug", payload.new.Depute)
            .then(handleSupabaseError)

          if (activeDepute) {
            const olderTL = olderBannerAnimation(setCurrentAnimation, data[0])
            olderTL.play()
          } else {
            setActiveDepute(data[0])
          }
        } else {
          const RENResult = await supabaseClient
            .from("GroupeParlementaire")
            .select("*")
            .eq("Sigle", "REN")
            .then(handleSupabaseError)

          const { data, error } = await supabaseClient
            .from("Ministre")
            .select("*")
            .eq("Slug", payload.new.Ministre)
            .then(handleSupabaseError)

          const ministreWithColors = Object.assign({}, data[0], {
            GroupeParlementaire: RENResult.data[0],
          })

          if (activeDepute) {
            const olderTL = olderBannerAnimation(setCurrentAnimation, ministreWithColors)
            olderTL.play()
          } else {
            setActiveDepute(ministreWithColors)
          }
        }
        setQuestion(payload.new.Question)
        setOverview(payload.new.Overview)
        setBannerState(payload.new.BannerState)
      })
      .subscribe()

    return () => {
      supabaseClient.removeSubscription(subscription)
    }
  }, [])

  const olderBannerAnimation = (setCurrentAnimation, depute, index = null) => {
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
    olderTL.call(() => {
      setActiveDepute(depute)
    })
    return olderTL
  }

  return (bannerState === "dep" || bannerState === "gov") && activeDepute ? (
    <DeputeBanner
      debug={false}
      bannerState={bannerState}
      depute={activeDepute}
      currentAnimation={currentAnimation}
      setCurrentAnimation={setCurrentAnimation}
      mapOpacity={mapOpacity}
      setMapOpacity={setMapOpacity}
      question={question}
      overview={overview}
    />
  ) : null
}

export async function getServerSideProps() {
  var res = await supabaseClient
    .from("Session")
    .select(
      `
        *,
        Depute (
          *,
          GroupeParlementaire (
            *
          )
        )
      `
    )
    .then(handleSupabaseError)
    .then((d) => d.body[0])

  return {
    props: {
      session: res,
      title: "Accropolis Live Tool",
    },
  }
}
