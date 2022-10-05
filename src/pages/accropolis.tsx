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

export default function Accropolis() {
  const { session } = Auth.useUser()
  const [currentAnimation, setCurrentAnimation] = useState({
    animation: null,
    type: null,
  })
  const [question, setQuestion] = useState("")
  const [mapOpacity, setMapOpacity] = useState({ value: 0 })
  const [activeDepute, setActiveDepute] = useState(null)
  const refMapOpacity = { value: 1 }
  const { overview, setOverview } = mapStore()
  const [bannerState, setBannerState] = useState("intro")

  useEffect(() => {
    if (session) {
      supabaseClient.auth.setAuth(session.access_token)

      supabaseClient
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
        .then((d) => {
          console.log("d:", d)
          setQuestion(d.Question)
          setActiveDepute(d.Depute)
          setBannerState(d.BannerState)
        })

      var subscription = supabaseClient
        .from("Session:id=eq.1234")
        .on("UPDATE", async (payload) => {
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

          setQuestion(payload.new.Question)
          setBannerState(payload.new.BannerState)
        })
        .subscribe()

      return () => {
        supabaseClient.removeSubscription(subscription)
      }
    }
  }, [])

  // Animations
  /*----------------------------------------------------*/
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
      forcedOverview={overview}
    />
  ) : null
}
