import React, { useState, useEffect } from "react"
import { fetchQuery } from 'utils/utils';
import { getDeputesAccropolis } from "../lib/deputes/Wrapper"
import Controls from "components/accropolis/Controls"
import { useRouter } from "next/router"
import controlsStyles from "components/accropolis/ControlsStyles.module.scss"
import deputeBannerStyles from "components/accropolis/DeputeBannerStyles.module.scss"
import { gsap } from "gsap"
import io from 'socket.io-client';
import mapStore from "src/stores/mapStore"
import jsonwebtoken from "jsonwebtoken"
import DeputeBanner from "src/components/accropolis/DeputeBanner";
// import accropolisStore from "src/stores/accropolisStore";

// Constantes
/*----------------------------------------------------*/
const LogoTwitch = ({size = 24}) => {
  return  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} x="0" y="0" viewBox="0 0 512 512">
    <g xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M48,0L16,96v352h128v64h64l64-64h96l128-136.32V0H48z M464,288l-89.6,96H260.928L192,434.144V384H80V32h384V288z" fill="#ffffff" data-original="#000000"/>
      </g>
    </g>
    <g xmlns="http://www.w3.org/2000/svg">
      <g>
        <rect x="240" y="128" width="32" height="128" fill="#ffffff" data-original="#000000"/>
      </g>
    </g>
    <g xmlns="http://www.w3.org/2000/svg">
      <g>
        <rect x="336" y="128" width="32" height="128" fill="#ffffff" data-original="#000000"/>
      </g>
    </g>
  </svg>
}

// Methods
/*----------------------------------------------------*/
function useSocket(url, setLoading, setAuthorized, isLogged) {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const socketIo = io(url, {
      auth: {token: localStorage.getItem('jwt')}
    })
    setSocket(socketIo)

    socketIo.on('connect_error', (err) => {
      console.error('connect_error', err)
    })

    socketIo.on('connect', () => {
      setAuthorized(true)
      setLoading(false)
    })

    socketIo.on('disconnect', () => {
      setAuthorized(false)
      setLoading(false)
    })

    // Cleanup when unloading the component
    function cleanup() {
      socketIo.disconnect()
    }
    return cleanup

    // should only run once and not on every re-render,
    // so pass an empty array
  }, [isLogged])

  return socket
}

// Component
/*----------------------------------------------------*/
export default function AccropolisLiveTools({allAccroDeputes, strapiGovernment}) {
  const router = useRouter()

  // Core component states
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [debug, setDebug] = useState('')
  
  // Banner states
  const [activeDepute, setActiveDepute] = useState(null)
  const [bannerState, setBannerState] = useState('intro')
  const [currentAnimation, setCurrentAnimation] = useState({
    animation: null,
    type: null,
  })
  const [question, setQuestion] = useState('')
  const [mapOpacity, setMapOpacity] = useState({value: 0})
  const refMapOpacity = {value: 1}
  const { overview, setOverview } = mapStore()

  let strapiURI
  process.env.NEXT_PUBLIC_ENV === 'production'
    ? strapiURI = 'https://accrogora.herokuapp.com'
    : strapiURI = 'http://localhost:1337'

  // Websockets state
  const socket = useSocket(`${strapiURI}/writer`, setLoading, setAuthorized, isLogged)

  // Websockets
  /*----------------------------------------------------*/
  useEffect(() => {
    // Check if socket exists
    if (socket) {
      socket.on('message', message => {
        console.log('message Socket : ',message)
      })

      socket.on('people', (depute) => {
        setActiveDepute(depute)
      })
      socket.on('question', question => {
        setQuestion(question)
      })

      socket.on('bannerState', bannerState => {
        setBannerState(bannerState)
        if (bannerState === 'intro' || bannerState === 'outro') {
          setActiveDepute(null)
        }
      })

      socket.on('overview', overview => {
        setOverview(overview)
      })

      socket.on('reset_question', () => {
        setQuestion('')
      })
    }
  }, [socket])


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
    olderTL.addLabel('olderTL')
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
    return olderTL
  }
  const cycleBannerContent = (event, people) => {
    if (event) { event.preventDefault() }
    if (currentAnimation.animation) {
      currentAnimation.animation.kill();
      if (currentAnimation.type === 'older') {
        socket.emit('depute_write', people)
        socket.emit('overview', overview)
        return
      }
    }

    // After timeline
    const olderTL = olderBannerAnimation(setCurrentAnimation)
    olderTL.call(() => {
      socket.emit('depute_write', people)
      socket.emit('overview', overview)
    }, [], '+=0.2')
    olderTL.play()
  }


  // Login / Logout handler
  /*----------------------------------------------------*/
  // If JWT already exists
  useEffect(() => {
    const jwt = localStorage.getItem('jwt')
    if (jwt) {
      const now = Math.floor(Date.now() / 1000)
      const expirationTimestamp = jsonwebtoken.decode(jwt).exp
      // console.log('expirationTimestamp', expirationTimestamp)
      // console.log('now', now)
      // console.log('expirationTimestamp > now', expirationTimestamp > now)
      if (expirationTimestamp < now) {
        // If JWT is defined but expired, remove is logged
        localStorage.removeItem('jwt');
        localStorage.removeItem('username');
        setIsLogged(false);
        if (socket) {
          socket.disconnect();
        }
      } else {
        // Check if logged
        setIsLogged(true)
      }
    }
  }, [])

  // When we trigger Strapi callback URL
  useEffect(() => {
    // Check if we don't have any login informations yet
    if ((!localStorage.jwt && !localStorage.username)) {
      // Fetch the twitch strapi auth
      fetch(`${strapiURI}/auth/twitch/callback${router.asPath.replace('/accropolis-live-tool', '')}`)
        // Error
        .then(res => {
          if (res.status !== 200) {
            throw new Error(`Couldn't login to Strapi. Status: ${res.status}`);
          }
          return res;
        })
        // Serialize response
        .then(res => res.json())
        .then(res => {
          // Successfully logged with Strapi
          // Now saving the jwt to use it for future authenticated requests to Strapi
          localStorage.setItem('jwt', res.jwt);
          localStorage.setItem('username', res.user.username);
          setIsLogged(!!localStorage.getItem('jwt'))
          if (res.user.moderator) {
            setAuthorized(true)
            router.push('/accropolis-live-tool');
          }
        })
        .catch(err => {
          new Error(err);
        });
    }
  }, [router])

  const logOut = e => {
    e.preventDefault();
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
    if (socket) {
      socket.disconnect();
    }
    setIsLogged(false);
  }

  // Render
  /*----------------------------------------------------*/
  return (
    <div className={`accropolis-live-tool${isLogged ? ' logged' : ' not-logged'}${isLogged && authorized ? ' authorized' : ' not-authorized'}${isLogged && authorized && loading ? ' loading' : ''}`}>
      {!isLogged ? (
        <div className="accropolis__login">
          <h2>Vous n'êtes pas connecté</h2>
          <a className="accropolis__login-btn" href={`${strapiURI}/connect/twitch`}>
            <p>Se connecter avec twitch</p>
            <LogoTwitch />
          </a>
        </div>
      )
      : (isLogged && !authorized) ? (
        <div className="accropolis__login">
          <h2>Compté créé avec succès...</h2>
          <p>
            Contactez un admin pour accéder à l'interface de contrôle<br/>
            Puis rechargez cette page
          </p>
          <button className="accropolis__logout-btn" onClick={() => {
            if (socket) {
              socket.auth.token = localStorage.getItem('jwt');
              socket.connect()
            }
          }}>
            Recharger la page
          </button>
          <br/>
          <button className="accropolis__logout-btn" onClick={logOut}>Se déconnecter</button>
        </div>
      ) 
      : (isLogged && authorized && loading) ? (
        <>
          <div className="accropolis__login">
              <LogoTwitch size={150} />
              <div className="login__content">
                <p>Bienvenue {localStorage.getItem('username')}, vous êtes connecté!</p>
                <button className="accropolis__logout-btn" onClick={logOut}>Déconnecter</button>
              </div>
            </div>
          <div className="lds-dual-ring">
            {/* Empty */}
          </div>
        </>
      )
      : (
        <>
          <div className="accropolis__login">
            <LogoTwitch size={150} />
            <div className="login__content">
              <p>Bienvenue {localStorage.getItem('username')}, vous êtes connecté!</p>
              <button className="accropolis__logout-btn" onClick={logOut}>Déconnecter</button>
            </div>
          </div>
          <div className="accropolis-live-tool__preview">
            <h2>Aperçu live</h2>
            <div className="controls__affichage">
              <button className={`${controlsStyles.btn} ${!debug ? controlsStyles.btnActive : ''}`} onClick={() => setDebug('')}>
                OBS
              </button>
              <button className={`${controlsStyles.btn} ${debug === 'small' ? controlsStyles.btnActive : ''}`} onClick={() => setDebug('small')}>
                Petit
              </button>
              <button className={`${controlsStyles.btn} ${debug === 'full' ? controlsStyles.btnActive : ''}`} onClick={() => setDebug('full')}>
                Plein
              </button>
            </div>
            {bannerState === 'intro' ? (
              <>Intro</>
            ) : bannerState === 'outro' ? (
              <>Outro</>
            ) : bannerState === 'dep' || bannerState === 'gov' ? (
              <DeputeBanner
                debug={debug}
                bannerState={bannerState}
                depute={activeDepute}
                currentAnimation={currentAnimation}
                setCurrentAnimation={setCurrentAnimation}
                mapOpacity={mapOpacity}
                setMapOpacity={setMapOpacity}
                question={question}
              />
            ) : null}
          </div>
          <div className="accropolis-live-tool__content">
            <Controls
              socket={socket}
              question={question}
              setQuestion={setQuestion}
              deputes={allAccroDeputes}
              activeDepute={activeDepute}
              cycleBannerContent={cycleBannerContent}
              currentAnimation={currentAnimation}
              setCurrentAnimation={setCurrentAnimation}
              olderBannerAnimation={olderBannerAnimation}
              government={strapiGovernment}
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
  const strapiGovernment = await fetchQuery('governments')
  const allAccroDeputes = await getDeputesAccropolis()
  console.log(allAccroDeputes[0]);

  return {
    props: {
      title: "Live Tool",
      allAccroDeputes,
      strapiGovernment
    },
  }
}

export { getServerSideProps }