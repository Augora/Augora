import React, { useState, useEffect } from "react"
import { fetchQuery } from 'utils/utils';
import { getDeputesAccropolis, getDeputeAccropolis } from "../lib/deputes/Wrapper"
import Accropolis from "components/accropolis/Accropolis"
import Controls from "components/accropolis/Controls"
import { useRouter } from "next/router"
import mapStore from "src/stores/mapStore"
import controlsStyles from "components/accropolis/ControlsStyles.module.scss"
import deputeBannerStyles from "components/accropolis/DeputeBannerStyles.module.scss"
import { gsap } from "gsap"

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

export default function AccropolisControls({allAccroDeputes, accroDeputes}) {
  const router = useRouter()
  const [isLogged, setIsLogged] = useState(false);
  const { overview, setOverview } = mapStore()
  const [deputeCurrentCard, setDeputeCurrentCard] = useState(0);
  const [activeDepute, setActiveDepute] = useState(accroDeputes[0].Depute)
  const [activeDeputeIndex, setActiveDeputeIndex] = useState(null);
  const [currentAnimation, setCurrentAnimation] = useState({
    animation: null,
    type: null,
  })
  const [debug, setDebug] = useState('')
  const [question, setQuestion] = useState('')
  const [mapOpacity, setMapOpacity] = useState({value: 0})
  const refMapOpacity = {value: 1}

  // Depute management
  /*----------------------------------------------------*/
  useEffect(() => {
    const isInList = accroDeputes.some(d => {
      return d.Depute.Slug === activeDepute.Slug
    })
    if (isInList) {
      accroDeputes.forEach((d, i) => {
        if (d.Depute.Slug === activeDepute.Slug) {
          setActiveDeputeIndex(i)
        } else {
          setActiveDeputeIndex(null)
        }
      })
    }
  }, [activeDepute])

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
    
    olderTL.to(`.${deputeBannerStyles.deputeBanner__questionInner}`, {
      x: '-100%',
      ease: 'power1.in',
      duration: 0.5,
    })
    olderTL.to(`.${deputeBannerStyles.deputeBanner__topBackground}`, {
      scaleX: 0,
      ease: 'power1.in',
    })
    olderTL.to(`.${deputeBannerStyles.deputeBanner__questionNumber}`, {
      x: '100%',
      ease: 'power1.in',
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
    return olderTL
  }
  const cycleDeputeCard = (event, depute) => {
    if (event) { event.preventDefault() }
    console.log('card Depute : ', depute.Nom)
    if (currentAnimation.animation) {
      currentAnimation.animation.kill();
      if (currentAnimation.type === 'older') {
        setActiveDepute(depute)
        return
      }
    }

    // After timeline
    const olderTL = olderBannerAnimation(setCurrentAnimation)
    olderTL.call(() => {
      setQuestion('')
      setActiveDepute(depute)
    }, [], '+=0.2')
    olderTL.play()
  }


  // Login / Logout handler
  /*----------------------------------------------------*/
  useEffect(() => {
    setIsLogged(!!localStorage.getItem('jwt'))
  }, [])

  useEffect(() => {
    fetch(`https://accrogora.herokuapp.com/auth/twitch/callback${router.asPath.replace('/accropolis-live-tool', '')}`)
      .then(res => {
        if (res.status !== 200) {
          throw new Error(`Couldn't login to Strapi. Status: ${res.status}`);
        }
        return res;
      })
      .then(res => res.json())
      .then(res => {
        // Successfully logged with Strapi
        // Now saving the jwt to use it for future authenticated requests to Strapi
        localStorage.setItem('jwt', res.jwt);
        localStorage.setItem('username', res.user.username);
        setIsLogged(!!localStorage.getItem('jwt'))
        router.push('/accropolis-live-tool');
      })
      .catch(err => {
        new Error(err);
      });
  }, [router])

  const logOut = e => {
    e.preventDefault();
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
    setIsLogged(false);
  }

  // Render
  /*----------------------------------------------------*/
  return (
    <div className={`accropolis-live-tool${isLogged ? ' logged' : ' not-logged'}`}>
      {!isLogged ? (
        <div className="accropolis__login">
          <h2>Vous n'êtes pas connecté</h2>
          <a className="accropolis__login-btn" href={`https://accrogora.herokuapp.com/connect/twitch`}>
            <p>Se connecter avec twitch</p>
            <LogoTwitch />
          </a>
        </div>
      ) : (
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
            <Accropolis
              accroDeputes={accroDeputes}
              depute={activeDepute}
              debug={debug}
              deputeCurrentCard={deputeCurrentCard}
              activeDeputeIndex={activeDeputeIndex}
              question={question}
            />
          </div>
          <div className="accropolis-live-tool__content">
            <Controls
              question={question}
              setQuestion={setQuestion}
              overview={overview}
              setOverview={setOverview}
              accroDeputes={accroDeputes}
              deputes={allAccroDeputes}
              activeDepute={activeDepute}
              setActiveDepute={setActiveDepute}
              activeDeputeIndex={activeDeputeIndex}
              setActiveDeputeIndex={setActiveDeputeIndex}
              cycleDeputeCard={cycleDeputeCard}
              currentAnimation={currentAnimation}
              setCurrentAnimation={setCurrentAnimation}
              olderBannerAnimation={olderBannerAnimation}
            />
          </div>
        </>
      )}
    </div>
  )
}

async function getServerSideProps() {
  const strapiDeputes = await fetchQuery('deputes')
  const accroDeputes = await Promise.all(strapiDeputes.map(async depute => {
    return await getDeputeAccropolis(depute.Depute_name)
  }))
  const allAccroDeputes = await getDeputesAccropolis()
  // const deputesNamesAndSlug = await getDeputesNames()

  return {
    props: {
      title: "Live Tool",
      accroDeputes,
      allAccroDeputes,
      // deputesNamesAndSlug,
    },
  }
}

export { getServerSideProps, fetchQuery }