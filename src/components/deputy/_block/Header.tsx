import React, { useState } from "react"
import IconInfo from "images/ui-kit/icon-info.svg"
import IconClose from "images/ui-kit/icon-close.svg"

/**
 * Return header block in a div
 * @param {*} props
 */
export default function Header(props: Bloc.Header) {
  const [infoVisible, setInfoVisible] = useState(false)

  const color = props.color.HSL.Full

  return (
    <div className={`${props.type}__header block__header`}>
      {/* Verify if the block is general infos */}
      {props.type === "general" ? (
        <h2 className="header__title">{props.title}</h2>
      ) : !props.circ ? (
        // Verify if the block has no circonscription data
        <h2
          className="header__title"
          style={{
            color: color,
          }}
        >
          {props.title}
        </h2>
      ) : (
        // If there is circonscription data, change the header text
        <div className="header__title" style={{ color: color }}>
          <span className="header__title--region">{props.circ.region}</span>
          <span className="header__title--numero">
            {props.circ.circNb}
            <sup>{props.circ.circNb < 2 ? "ère " : "ème "}</sup>
            circonscription
          </span>
        </div>
      )}
      {props.info && (
        <div className="header__info">
          <button className="info__btn" title="Informations" onClick={() => setInfoVisible(!infoVisible)}>
            <IconInfo style={{ fill: props.color.HSL.Full }} />
          </button>
          {infoVisible && (
            <div className="info__content" style={{ backgroundColor: props.color.HSL.Full }}>
              <button className="info__btn content__close" onClick={() => setInfoVisible(false)}>
                <IconClose />
              </button>
              {props.info}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
