import React, { useState, useEffect } from "react"
import DeputeBanner from "components/accropolis/DeputeBanner";
import { fetchQuery } from 'utils/utils';
import { getDeputeAccropolis } from "../lib/deputes/Wrapper"
import io from 'socket.io-client';

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
  // console.log(props)
  const [currentAnimation, setCurrentAnimation] = useState({
    animation: null,
    type: null,
  })
  const [mapOpacity, setMapOpacity] = useState({value: 0})
  const [activeDepute, setActiveDepute] = useState(accroDeputes[0].Depute)
  
  // Websockets
  /*----------------------------------------------------*/
  const socket = useSocket('ws://localhost:1337')
  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('Socket : ', socket)
        socket.emit('message', 'CONNEXION : accropolis.tsx')
      })

      socket.on('depute_read', depute => {
        setActiveDepute(depute)
      })
    }
  }, [socket])

  // Render
  /*----------------------------------------------------*/
  return (
    <DeputeBanner
      debug={false}
      numberOfQuestions={accroDeputes.length}
      depute={activeDepute}
      // depute={activeDepute ? activeDepute : accroDeputes[deputeCurrentCard].Depute}
      index={null}
      currentAnimation={currentAnimation}
      setCurrentAnimation={setCurrentAnimation}
      mapOpacity={mapOpacity}
      setMapOpacity={setMapOpacity}
      question={''}
    />
  )
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