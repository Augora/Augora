import React from "react"
import block, { MyState } from "utils/styled-components/block"
import styled from "styled-components"
import moment from "moment-with-locale-es6"
import "moment/locale/fr"

export interface IOtherMandate {
  Localite: String
  Institution: String
  Intitule: String
}

export interface IOtherMandates {
  othersMandates: [IOtherMandate]
}

class OthersMandates extends React.Component<IOtherMandates, MyState> {
  constructor(props: IOtherMandates) {
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

    const OtherMandate = styled.p`
      margin: 0;
    `

    moment.locale("fr")
    //    var dateToDisplay = moment(this.props.dateBegin).format('Do MMMM YYYY');
    return (
      <Block>
        <Title>Autres mandats</Title>
        {this.props.othersMandates.map((otherMandate) => {
          return (
            <OtherMandate>
              {otherMandate.Localite} - {otherMandate.Institution} -{" "}
              {otherMandate.Intitule}
            </OtherMandate>
          )
        })}
      </Block>
    )
  }
}

export default OthersMandates
