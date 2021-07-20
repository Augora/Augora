import React, { useState, useEffect } from "react"
import dayjs from "dayjs"
import "dayjs/locale/fr"
dayjs.locale("fr")

import IconMale from "images/ui-kit/icon-persontie.svg"
import IconFemale from "images/ui-kit/icon-personw.svg"

import Block from "../_block/_Block"
import DeputyImage from "./deputy-image/DeputyImage"

const getDates = (date: string) => {
  const formatedDate = dayjs(date)
  const dateDay = formatedDate.format("DD")
  const dateMonth = formatedDate.format("MMMM")
  const dateYear = formatedDate.format("YYYY")

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
export default function GeneralInformation(props: Bloc.General) {
  const [Date, setDate] = useState({
    day: "01",
    month: "janvier",
    year: "2020",
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
      <div className="icon-wrapper">{props.sexe === "F" ? <IconFemale /> : <IconMale />}</div>
      <div className={`block__main general__main`}>
        <div className="main__picture">
          <div
            className="main__picture-container"
            style={{
              borderColor: props.color.HSL.Full,
            }}
          >
            <DeputyImage src={props.picture} alt={props.id} sex={props.sexe} />
            <figure
              className="svg-placeholder"
              style={{
                backgroundImage: `linear-gradient(-45deg, ${props.color.HSL.Full}, hsl(${props.color.HSL.H}, ${
                  props.color.HSL.S
                }%, ${props.color.HSL.L + 5}%)`,
              }}
            >
              {props.sexe === "F" ? (
                <svg className="icon-missingfemale" viewBox="0 0 390 500">
                  <ellipse
                    transform="matrix(0.7071 -0.7071 0.7071 0.7071 -32.4978 174.1705)"
                    cx="194"
                    cy="126.3"
                    rx="94.3"
                    ry="94.3"
                  />
                  <path
                    d="M336.2,500c0.1-2,0.2-4,0.2-6.1c0-0.2,0-0.5,0-0.7V308.1c0.4-14.7-7.2-28.4-19.8-35.9c-13.7-8.6-28.3-15.7-43.5-21.3
                    c-3.7-1.8-7.7-3.1-11.7-4h-0.5c-1.6-0.5-3.2-0.9-4.8-1c0,0-26.3-5-31.7,11.4c0,0-20.6,64.2-22.8,71.2c-2.2,7-10.6,8.2-12.9-0.4
                    c-2.3-8.6-24.6-70.7-24.6-70.7c-4.1-9.1-13.7-14.3-23.6-12.9c-3.4,0.6-6.2,1.2-8.3,1.6c-2,0.6-4.1,1.1-6.2,1.4
                    c-19.6,6.2-38.4,14.8-55.8,25.9c-11.5,7.8-18.2,20.9-17.9,34.7v185.1c0,0.3,0,0.6,0,0.9c0,2,0.1,3.9,0.3,5.9H336.2z"
                  />
                </svg>
              ) : (
                <svg className="icon-missingmale" viewBox="0 0 390 500">
                  <circle cx="194.5" cy="126.3" r="94.4" />
                  <path
                    d="M217.2,246.1h-43.8c-7.3,0-9.7,4.8-5.5,10.7l14.8,20.5c-0.3,0.7-0.5,1.4-0.6,2.1l-8.5,36.5c-1.6,8.4-0.9,17,1.8,25.1
                    l14.9,37.6c2.7,6.7,7,6.7,9.7,0l14.9-38c2.7-8.1,3.3-16.7,1.7-25.1l-8.7-36.1c-0.2-0.8-0.5-1.6-0.8-2.4l15.3-20.2
                    C226.8,250.8,224.5,246.1,217.2,246.1z"
                  />
                  <path
                    d="M360.5,500c0.1-0.7,0.1-1.4,0.1-2.1V308.2c-0.1-15.5-9.1-29.4-23.2-35.9c-14-7.4-28.5-13.7-43.5-18.9l-0.8-0.4
                    c-1.8-0.6-3.6-1.2-5.4-1.8c-1.1-0.2-2.2-0.3-3.4-0.3c-8.5,0-15.9,5.6-18.3,13.8L199.7,434c-2.6,6.7-6.9,6.7-9.6,0l-66-169.1
                    l-0.4-1.1l-0.2-0.6c-3.2-7.4-10.6-12.2-18.8-12c-1.3,0-2.6,0.1-3.9,0.4c-1.7,0.5-3.4,1.1-5.1,1.7l-0.8,0.4
                    c-15.6,5.3-30.8,12-45.3,19.8c-12.9,6.8-21,20.3-21,34.9v189.7c0,0.7,0.1,1.4,0.1,2.1H360.5z"
                  />
                </svg>
              )}
              <figcaption>Pas de photo</figcaption>
            </figure>
          </div>
        </div>
        <div className="main__info">
          <div className="icon-wrapper" title={props.groupeComplet}>
            <props.pictureGroup />
          </div>
          <div className="main__age">
            <div className="main__age-date">
              {props.age}
              <div>ans</div>
            </div>
            <div className="main__birthday">
              <h3>{props.sexe === "F" ? `Née le` : `Né le`}</h3>
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
        <div className="job">{props.job ? props.job : "Sans profession"}</div>
        {props.party && <div className="party">{`Rattachement financier: ${props.party}`}</div>}
      </div>
    </Block>
  )
}
