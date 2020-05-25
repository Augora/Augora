import React from "react"
import Header from "./Header"
import styled from "styled-components"
import IconWIP from "images/ui-kit/icon-wip.svg"

const BlockFrame = styled.div`
  border-color: ${(props) => props.color};
`
const BlockBackground = styled.div`
  background-color: ${(props) =>
    props.type === "general" ? props.color : "#f3f3f3"};
`

export default function _Block(props)
{
  console.log(props.icon)
  return (
    <BlockFrame
      color={props.color}
      className={`deputy__block block__${props.type} deputy__block--${
        props.size ? props.size : "medium"
        }`}
    >
      <Header type={props.type} title={props.title} color={props.color} />
      <BlockBackground
        type={props.type}
        color={props.color}
        className={`block__background ${props.type}__background`}
      />

      <div
        className={`block__content ${props.type}__content ${
          props.wip ? "block__content--wip" : ""
          }`}
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
    </BlockFrame>
  )
}
