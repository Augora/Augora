import React from "react"
import Header from "./Header"
import IconWIP from "images/ui-kit/icon-wip.svg"
import { getHSLLightVariation } from "utils/style/color"

/**
 * Renvoie un bloc générique de la page détail
 * @param props
 */
export default function _Block(props: Bloc.Block) {
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
  return (
    <div
      color={HSLFull}
      className={`deputy__block block__${props.type} deputy__block--${props.size ? props.size : "medium"}`}
      style={{ borderColor: HSLFull }}
    >
      <Header type={props.type} title={props.title} color={props.color} circ={props.circ} />
      <div color={HSLFull} className={`block__background ${props.type}__background`} style={backgroundStyle} />

      <div className={`block__content ${props.type}__content ${props.wip ? "block__content--wip" : ""}`}>
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
    </div>
  )
}
