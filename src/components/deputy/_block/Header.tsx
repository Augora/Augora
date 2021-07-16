import React from "react"
import IconExport from "images/ui-kit/icon-export.svg"
import ButtonIcon from "src/components/buttons/ButtonIcon"

/**
 * Return header block in a div
 * @param {*} props
 */
export default function Header(props: Bloc.Header) {
  const color = props.color.HSL.Full
  return (
    <div className={`${props.type}__header block__header`}>
      {/* Verify if the block is general infos */}
      {props.type === "general" ? (
        <h2 className="header__title">{props.title}</h2>
      ) : props.type === "feed" ? (
        <>
          <h2
            className="header__title"
            style={{
              color: color,
            }}
          >
            {props.title}
          </h2>
          <ButtonIcon
            onClick={`https://twitter.com/${props.twitterUrl}`}
            className="feed__right"
            title={"Twitter"}
            target="_blank"
          >
            <div className="icon-wrapper" style={{ width: "30px" }}>
              <IconExport style={{ fill: color }} />
            </div>
          </ButtonIcon>
        </>
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
    </div>
  )
}
