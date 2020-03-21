import React from "react"
import block, { MyState } from "Utils/StyledComponents/block"
import styled from "styled-components"
import moment from "moment"
import "moment/locale/fr"

export interface IOldMandate {
  DateDeDebut: String
  DateDeFin: String
  Intitule: String
}

export interface IOldMandates {
  oldMandates: [IOldMandate]
}

class OldMandates extends React.Component<IOldMandates, MyState> {
  constructor(props: IOldMandates) {
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

    const DateMandate = styled.p`
      margin: 0;
    `

    moment.locale("fr")
    //    var dateToDisplay = moment(this.props.dateBegin).format('Do MMMM YYYY');
    return (
      <Block>
        <Title>Anciens mandats</Title>
        {this.props.oldMandates.map(oldMandate => {
          return (
            <DateMandate>
              Du {moment(oldMandate.DateDeDebut).format("Do MMMM YYYY")} au{" "}
              {moment(oldMandate.DateDeFin).format("Do MMMM YYYY")} :{" "}
              {oldMandate.Intitule}
            </DateMandate>
          )
        })}
      </Block>
    )
  }
}

export default OldMandates
