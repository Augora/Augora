import React from "react"
import Header from "./Header"
import IconWIP from "images/ui-kit/icon-wip.svg"

/**
 * Renvoie un bloc générique de la page détail
 * @param props
 */
export default function _Block(props: Bloc.Block) {
  return (
    <div
      color={props.color}
      className={`deputy__block block__${props.type} deputy__block--${props.size ? props.size : "medium"}`}
      style={{ borderColor: props.color }}
    >
      <Header type={props.type} title={props.title} color={props.color} circ={props.circ} />
      <div
        color={props.color}
        className={`block__background ${props.type}__background`}
        style={{
          backgroundColor: props.type === "general" ? props.color : "#f3f3f3",
        }}
      />

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
