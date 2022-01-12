import React, { useEffect, useState } from "react"
import Header from "./Header"
import Button from "src/components/buttons/Button"
import IconWIP from "images/ui-kit/icon-wip.svg"
import IconClose from "images/ui-kit/icon-close.svg"
import { getHSLLightVariation } from "utils/style/color"

/**
 * Renvoie un bloc générique de la page détail
 * @param props
 */
export default function _Block(props: Bloc.Block) {
  const { isLockedByDefault = false } = props
  const [hasAgreed, setHasAgreed] = useState(isLockedByDefault ? "false" : "true")
  const [infoVisible, setInfoVisible] = useState(false)

  const HSLFull = props.color.HSL.Full
  const HSL = props.color.HSL
  const gradientStart = getHSLLightVariation(HSL, 0)
  const gradientEnd = getHSLLightVariation(HSL, -20)
  const backgroundStyle = {
    background: "",
  }
  if (props.type === "general") {
    backgroundStyle.background = `linear-gradient(135deg, hsla(${HSL.H}, ${HSL.S}%, ${gradientStart}%, 1), hsla(${HSL.H}, ${HSL.S}%, ${gradientEnd}%, 1))`
  } else {
    backgroundStyle.background = "#f3f3f3"
  }

  useEffect(() => {
    if (isLockedByDefault) {
      if (localStorage.getItem(`${props.type}.Autorisation`) === null) {
        localStorage.setItem(`${props.type}.Autorisation`, "false")
      }
      const cache = localStorage.getItem(`${props.type}.Autorisation`)
      setHasAgreed(cache)
      setInfoVisible(cache === "true" ? false : true)
    }
  }, [])

  return (
    <div
      color={HSLFull}
      className={`deputy__block block__${props.type} deputy__block--${props.size ? props.size : "medium"}`}
      style={{ borderColor: HSLFull }}
    >
      <Header
        type={props.type}
        title={props.title}
        color={props.color}
        circ={props.circ}
        onClick={props.info ? setInfoVisible : null}
      />
      <div color={HSLFull} className={`block__background ${props.type}__background`} style={backgroundStyle} />

      <div
        className={`block__content ${props.type}__content ${props.wip ? "block__content--wip" : ""}`}
        style={props.type === "presence" ? { height: "85%" } : {}}
      >
        {!props.wip ? (
          props.children
        ) : (
          <div className="wip__content">
            <p>Bloc en cours de construction</p>
            <div className="wip__svg-container">
              <IconWIP />
            </div>
          </div>
        )}
      </div>
      {props.info && infoVisible && (
        <div className="block__popup">
          <div className="popup__overlay" onClick={() => hasAgreed === "true" && setInfoVisible(false)} />
          <div className="popup__info" style={{ border: `2px solid ${props.color.HSL.Full}` }}>
            {hasAgreed === "true" && (
              <button className="info__close" onClick={() => setInfoVisible(false)}>
                <IconClose style={{ fill: props.color.HSL.Full }} />
              </button>
            )}
            {props.info}
            {hasAgreed === "false" && (
              <Button
                className="popup__ok"
                onClick={() => {
                  setInfoVisible(false)
                  setHasAgreed("true")
                  localStorage.setItem(`${props.type}.Autorisation`, "true")
                }}
                style={{ backgroundColor: props.color.HSL.Full, borderColor: props.color.HSL.Full }}
              >
                J'ai compris
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
