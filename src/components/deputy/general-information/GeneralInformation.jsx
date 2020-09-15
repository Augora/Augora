import React, { useState, useEffect } from "react"
import moment from "moment-with-locales-es6"
import Block from "../_block/_Block"
import IconMale from "images/ui-kit/icon-persontie.svg"
import IconFemale from "images/ui-kit/icon-personw.svg"
import DeputyImage from "./deputy-image/DeputyImage"

const getDates = (date) => {
  moment.locale("fr")
  const now = moment() // eslint-disable-line
  const formatedDate = moment(date)
  const dateDay = formatedDate.day("").format("DD")
  const dateMonth = formatedDate.month("").format("MMMM")
  const dateYear = formatedDate.year()

  return {
    day: dateDay,
    month: dateMonth,
    year: dateYear,
  }
}

/**
 * Return deputy's general information in a Block component
 * @param {*} props
 */
export default function GeneralInformation(props) {
  const [Date, setDate] = useState({
    day: "01",
    month: "janvier",
    year: "2020",
    yearsPassed: "1",
    monthsPassed: "1",
  })

  useEffect(() => {
    setDate(getDates(props.dateBegin))
  }, [props.dateBegin])

  return (
    <Block
      className="deputy__block deputy__general"
      title="Informations Générales"
      type="general"
      color={props.color}
      size={props.size}
      wip={props.wip ? props.wip : false}
    >
      <div className="icon-wrapper">
        {props.sexe === "F" ? <IconFemale /> : <IconMale />}
      </div>
      <div className={`block__main general__main`}>
        <div className="main__picture">
          <DeputyImage src={props.picture} alt={props.id} sex={props.sexe} />
        </div>
        <div className="main__info">
          <img src={props.pictureGroup} alt={props.groupe} />
          <div className="main__age">
            <div className="main__age-date">
              {props.age}
              <div>ans</div>
            </div>
            <div className="main__birthday">
              <h3>Né le</h3>
              <p className="birthday__day-month">
                <strong>{Date.day}</strong> {Date.month}
              </p>
              <p className="birthday__year">
                <strong>{Date.year}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="general__job">
        <div className="job">{props.job}</div>
      </div>
    </Block>
  )
}
