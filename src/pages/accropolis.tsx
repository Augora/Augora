import React, { useState, useEffect } from "react"
import DeputeBanner from "components/accropolis/DeputeBanner";
import deputeBannerStyles from "components/accropolis/DeputeBannerStyles.module.scss"
import { gsap } from "gsap"
import io from 'socket.io-client';
import mapStore from "src/stores/mapStore"

// Methods
/*----------------------------------------------------*/
function useSocket(url) {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const socketIo = io(url)

    setSocket(socketIo)

    function cleanup() {
      socketIo.disconnect()
    }
    return cleanup

    // should only run once and not on every re-render,
    // so pass an empty array
  }, [])

  return socket
}

export default function Accropolis() {
  const [currentAnimation, setCurrentAnimation] = useState({
    animation: null,
    type: null,
  })
  const [question, setQuestion] = useState('')
  const [mapOpacity, setMapOpacity] = useState({value: 0})
  const [activeDepute, setActiveDepute] = useState(null)
  const refMapOpacity = {value: 1}
  const { overview, setOverview } = mapStore()
  const [bannerState, setBannerState] = useState('intro')

  const strapiURI = 'https://accrogora.herokuapp.com'
  // const strapiURI = 'http://localhost:1337'
  
  // Websockets
  /*----------------------------------------------------*/
  const socket = useSocket(`${strapiURI}/reader`)
  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        socket.emit('message', 'CONNEXION : accropolis.tsx')
      })
      socket.on('message', message => {
          console.log('message Socket : ',message)
      })
      socket.on('people', (depute) => {
        console.log('[READER] people received : ', depute)
        // Launch disappearing animation
        const olderTL = olderBannerAnimation(setCurrentAnimation, depute)
        olderTL.play()
      })
      socket.on('question', question => {
        setQuestion(question)
      })
      socket.on('bannerState', (bannerState) => {
        setBannerState(bannerState)
        if (bannerState === 'intro' || bannerState === 'outro') {
          setActiveDepute(null)
        }
      })
      socket.on('overview', overview => {
        setOverview(overview)
      })
    }
  }, [socket])

  // Animations
  /*----------------------------------------------------*/
  const olderBannerAnimation = (setCurrentAnimation, depute, index = null) => {
    // Timeline
    const olderTL = gsap.timeline({
      onComplete: () => {
        setCurrentAnimation({
          animation: null,
          type: null,
        })
      },
    })
    olderTL.addLabel('olderTL')
    olderTL.call(() => {
      setCurrentAnimation({
        animation: olderTL,
        type: "older",
      })
    })

    olderTL.to(`.${deputeBannerStyles.deputeBanner__content} > *`, {
      x: '-100%',
      autoAlpha: 0,
      ease: 'power1.in'
    }, '-=0.3')
    olderTL.to(`.${deputeBannerStyles.deputeBanner__logoGroup}`, {
      x: '-100px',
      autoAlpha: 0,
      ease: 'power1.in'
    }, '-=0.3')
    olderTL.to(`.${deputeBannerStyles.deputeBanner__mapHeader}`, {
      height: 0,
      ease: 'power1.in'
    }, '-=0.6')
    olderTL.to(refMapOpacity, {
      value: 0,
      duration: 0.2,
      onUpdate: () => {
        setMapOpacity({value: refMapOpacity.value})
      }
    })
    olderTL.call(() => {
        setActiveDepute(depute)
    })
    return olderTL
  }

  // Render
  /*----------------------------------------------------*/
  return (
    bannerState === 'intro' ? (
      <>Intro</>
    ) : bannerState === 'outro' ? (
      <>Outro</>
    ) : bannerState === 'dep' || bannerState === 'gov' ? (
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
  )
}