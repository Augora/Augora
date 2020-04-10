import React from "react"
import block, { MyState } from "utils/styled-components/block"
import styled from "styled-components"
import moment from "moment-with-locale-es6"
import "moment/locale/fr"

export interface ITotalMandates {
  isInMandate: boolean
  dateBegin: string
  numberMandates: number
}

class TotalMandates extends React.Component<ITotalMandates, MyState> {
  constructor(props: ITotalMandates) {
    super(props)

    this.state = {
      blockSize: "block",
    }
  }
  render() {
    const Block = styled.div`
      display: flex;
      flex-direction: column;
      grid-column-end: span 1;
      background-color: rgba(0, 0, 0, 0.15);
      border: solid 2px rgba(0, 0, 0, 0.25);
      border-radius: 2px;
      padding: 10px;
    `
    const Title = styled.h2``

    const P = styled.p`
      margin: 0;
    `

    return (
      <Block>
        <Title>Nombre de mandats totaux</Title>
        <P>Mandats totaux : {this.props.numberMandates}</P>
      </Block>
    )
  }
}

export default TotalMandates
