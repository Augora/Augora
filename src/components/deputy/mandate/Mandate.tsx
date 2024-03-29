import React, { useEffect, useState } from "react"
import dayjs from "dayjs"
import "dayjs/locale/fr"
dayjs.locale("fr")
import duration from "dayjs/plugin/duration"

import Block from "../_block/_Block"
import IconMandat from "images/ui-kit/icon-mandat.svg"

const getDates = (date: string) => {
  const now = dayjs()
  const formatedDate = dayjs(date)
  const dateDay = formatedDate.format("DD")
  const dateMonth = formatedDate.format("MMMM")
  const dateYear = formatedDate.format("YYYY")
  const yearsPassed = now.diff(formatedDate, "years")
  const monthsPassed = now.diff(formatedDate, "months") % 12
  const daysPassed = now.diff(formatedDate, "days")

  return {
    day: dateDay,
    month: dateMonth,
    year: dateYear,
    yearsPassed: yearsPassed,
    monthsPassed: monthsPassed,
    daysPassed: daysPassed,
  }
}

/**
 * Return deputy's mandate in a Block component
 * @param {*} props
 */
export default function Mandate(props: Bloc.Mandate) {
  const [Date, setDate] = useState({
    day: "01",
    month: "janvier",
    year: "2020",
    yearsPassed: 0,
    monthsPassed: 0,
    daysPassed: 0,
  })

  useEffect(() => {
    setDate(getDates(props.dateBegin))
  }, [props.dateBegin])

  let numberComplement = ""
  props.numberMandates < 2 ? (numberComplement = "er") : (numberComplement = "ème")
  return (
    <Block title="Mandats" type="mandate" color={props.color} size={props.size} wip={props.wip ? props.wip : false}>
      <div className="icon-wrapper">
        <IconMandat />
      </div>
      <div className="mandate__number" style={{ color: props.color.HSL.Full }}>
        <div className="number__holder">
          {props.numberMandates}
          <sup>{numberComplement}</sup>
        </div>
        <div className="number__title">mandat</div>
      </div>
      <div className="mandate__dates">
        <div className="mandate__since">
          {Date.yearsPassed > 0 ? (
            <p>
              <span style={{ color: props.color.HSL.Full }}>{Date.yearsPassed}</span>{" "}
              <strong>{Date.yearsPassed === 1 ? "An" : "Ans"}</strong>
            </p>
          ) : null}
          {Date.monthsPassed > 0 ? (
            <p>
              <span style={{ color: props.color.HSL.Full }}>{Date.monthsPassed}</span> <strong>Mois</strong>
            </p>
          ) : null}
          {Date.monthsPassed === 0 && Date.yearsPassed === 0 ? (
            <p>
              <span style={{ color: props.color.HSL.Full }}>{Date.daysPassed}</span>{" "}
              <strong>{Date.daysPassed < 2 ? "Jour" : "Jours"}</strong>
            </p>
          ) : null}
          <p>
            <strong>d'activité</strong>
          </p>
        </div>
        <div className="mandate__begin">
          <p>Depuis le</p>
          <p className="begin__day-month">
            <span style={{ color: props.color.HSL.Full }}>{Date.day}</span> {Date.month}
          </p>
          <p className="begin__year" style={{ color: props.color.HSL.Full }}>
            {Date.year}
          </p>
        </div>
      </div>
    </Block>
  )
}
