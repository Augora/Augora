import React from "react"
import Header from "./Header"
import styled from "styled-components"

export default function _Block(props) {
  const Block = styled.div`
    border-color: ${props.color};
  `
  const BlockBackground = styled.div`
    background-color: ${props.type === "general" ? props.color : "#f7f7f7"};
  `
  return (
    <Block
      className={`deputy__block block__${props.type} deputy__block--${
        props.size ? props.size : "medium"
      }`}
    >
      <Header type={props.type} title={props.title} color={props.color} />
      <BlockBackground
        className={`block__background ${props.type}__background`}
      />
      <div className={`block__content ${props.type}__content`}>
        {!props.wip ? props.children : <div>Work in progress</div>}
      </div>
    </Block>
  )
}
