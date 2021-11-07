import React, { useState, useEffect } from "react"
import DeputeBanner from "components/accropolis/DeputeBanner";
import deputeBannerStyles from "components/accropolis/DeputeBannerStyles.module.scss"
import { fetchQuery } from 'utils/utils';
import { getDeputeAccropolis } from "../lib/deputes/Wrapper"
import { gsap } from "gsap"
import io from 'socket.io-client';
import mapStore from "src/stores/mapStore"

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

export default function Accropolis({accroDeputes}) {
  const [currentAnimation, setCurrentAnimation] = useState({
    animation: null,
    type: null,
  })
  const [question, setQuestion] = useState('')
  const [mapOpacity, setMapOpacity] = useState({value: 0})
  const [activeDepute, setActiveDepute] = useState(null)
  const [dindex, setDindex] = useState(null);
  const refMapOpacity = {value: 1}
  const { overview, setOverview } = mapStore()
  
  // Websockets
  /*----------------------------------------------------*/
  const socket = useSocket('ws://localhost:1337/reader')
  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        socket.emit('message', 'CONNEXION : accropolis.tsx')
        // socket.emit('req_depute')
      })
      socket.on('message', message => {
          console.log('message Socket : ',message)
      })
      socket.on('depute_read', depute => {
        console.log('on depute_read : ', depute.Slug)
        // const rindex = accroDeputes.findIndex(d => {
        //   return d.Depute.Slug === depute.Slug
        // })

        // Launch disappearing animation
        // const olderTL = olderBannerAnimation(setCurrentAnimation, depute, rindex >= 0 ? rindex + 1 : null)
        const olderTL = olderBannerAnimation(setCurrentAnimation, depute)
        olderTL.play()
      })
      socket.on('question', question => {
        setQuestion(question)
      })
      socket.on('overview', overview => {
        setOverview(overview)
      })
      socket.on('resp_depute', depute => {
        setActiveDepute(depute)
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
    
    olderTL.to(`.${deputeBannerStyles.deputeBanner__questionInner}`, {
      x: '-100%',
      ease: 'power1.in',
      duration: 0.5,
    })
    olderTL.to(`.${deputeBannerStyles.deputeBanner__topBackground}`, {
      scaleX: 0,
      ease: 'power1.in',
    })
    // olderTL.to(`.${deputeBannerStyles.deputeBanner__questionNumber}`, {
    //   x: '100%',
    //   ease: 'power1.in',
    // })
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
        // setDindex(index)
        setOverview(false)
    })
    return olderTL
  }

  // Render
  /*----------------------------------------------------*/
  return activeDepute ? (
      <DeputeBanner
        debug={false}
        // numberOfQuestions={accroDeputes.length}
        depute={activeDepute}
        // depute={activeDepute ? activeDepute : accroDeputes[deputeCurrentCard].Depute}
        // index={dindex}
        currentAnimation={currentAnimation}
        setCurrentAnimation={setCurrentAnimation}
        mapOpacity={mapOpacity}
        setMapOpacity={setMapOpacity}
        question={question}
      />
  ) : null
}

async function getServerSideProps() {
  const strapiDeputes = await fetchQuery('deputes')
  const accroDeputes = await Promise.all(strapiDeputes.map(async depute => {
    return await getDeputeAccropolis(depute.Depute_name)
  }))

  return {
    props: {
      accroDeputes,
      // pageBlank: true,
    },
  }
}

export { getServerSideProps, fetchQuery }