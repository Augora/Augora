import React from "react"
import Block from "../_Block/_Block"

export default function Mandate(props) {
  let numberComplement = ""
  props.numberMandates < 2
    ? (numberComplement = "er")
    : (numberComplement = "eme")
  return (
    <Block title="Mandats" type="mandate" color={props.color}>
      <div className="mandate__number" style={{ color: props.color }}>
        <div className="number__holder">
          {props.numberMandates}
          <sup>{numberComplement}</sup>
        </div>
        <div className="number__title">mandat</div>
      </div>
      <div className="mandate__since">{props.dateBegin}</div>
    </Block>
  )
}
