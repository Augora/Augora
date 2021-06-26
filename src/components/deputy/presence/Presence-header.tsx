import React, { useState, useEffect, useRef } from "react"

import IconAgenda from "images/ui-kit/icon-agenda.svg"
import IconInfo from "images/ui-kit/icon-info.svg"
import IconClose from "images/ui-kit/icon-close.svg"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import dayjs from "dayjs"

interface IPresenceHeader {
  width: number
  data: Deputy.Activite[]
  setRange: React.Dispatch<React.SetStateAction<Deputy.Activite[]>>
}

dayjs.locale("fr")

const getCalendarDates = (date: string) => {
  return {
    getDate: dayjs(date).toDate(),
  }
}

export default function PresenceHeader(props: IPresenceHeader) {
  var { width, data, setRange } = props

  const isMobile = width < 300
  const [Calendrier, setCalendrier] = useState(false)
  const [DateButton, setDateButton] = useState(isMobile ? 2 : 3)
  const [Informations, setInformations] = useState(false)
  const [InformationsCached, setInformationsCached] = useState(undefined)

  useEffect(() => {
    if (localStorage.getItem("informations.Autorisation") === null) {
      localStorage.setItem("informations.Autorisation", "false")
      setInformations(true)
    }
    setInformationsCached(localStorage.getItem("informations.Autorisation"))
  }, [])

  const dateMax = data.length != 0 ? getCalendarDates(data[data.length - 1].DateDeFin).getDate : ""

  const [startDate, setStartDate] = useState(dateMax)
  const [endDate, setEndDate] = useState(null)

  const dateMin = data.length != 0 ? getCalendarDates(data[0].DateDeDebut).getDate : ""
  const rangeCalendar = dayjs(endDate).diff(dayjs(startDate), "day") + 1

  const weekMin = Math.ceil((dayjs(dateMax).diff(startDate, "day") + 1) / 7)
  const weekMax = Math.ceil((dayjs(dateMax).diff(endDate, "day") + 1) / 7)

  const onChange = (dates) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  useEffect(() => {
    if (isMobile) {
      setDateButton(2)
    } else {
      setDateButton(3)
    }
  }, [width])

  useEffect(() => {
    if (DateButton === 4) {
      if (weekMax) {
        setRange(data.slice(53 - weekMin, 53 - weekMax))
      }
      setRange(data)
    } else if (DateButton === 3) {
      setRange(data)
    } else if (DateButton === 2) {
      setRange(data.slice(27, 53))
    } else if (DateButton === 1) {
      setRange(data.slice(40, 53))
    } else {
      setRange(data.slice(49, 53))
    }
  }, [DateButton])

  useEffect(() => {
    if (DateButton === 4) {
      if (weekMax) {
        setRange(data.slice(53 - weekMin, 53 - weekMax))
      }
    }
  }, [weekMax])

  const ButtonGroup = ({ buttons }) => {
    return (
      <>
        {buttons.map((buttonLabel, i) => (
          <button
            key={i}
            name={buttonLabel}
            onClick={() => {
              i <= 3 ? (setDateButton(i), setCalendrier(false)) : (setDateButton(i), setCalendrier(!Calendrier))
            }}
            className={i === DateButton ? "button__active button" : "button"}
          >
            {i === 4 ? <IconAgenda className={"icon-agenda"} /> : buttonLabel}
          </button>
        ))}
      </>
    )
  }

  const node = useRef<HTMLDivElement>()

  useEffect(() => {
    document.addEventListener("mousedown", handleClick)
    return () => {
      document.removeEventListener("mousedown", handleClick)
    }
  }, [])
  const handleClick = (e) => {
    if (node?.current) {
      if (!node.current.contains(e.target)) {
        setCalendrier(false)
      }
    }
  }

  return (
    <div>
      <div className="presence__informations">
        <button
          className="info__button"
          onClick={() => (
            setInformations(!Informations),
            InformationsCached === "false"
              ? (setInformationsCached(true), localStorage.setItem("informations.Autorisation", "true"))
              : ""
          )}
          title="Informations"
        >
          {InformationsCached === "false" || Informations ? (
            <IconClose className={"icon-close"} />
          ) : (
            <IconInfo className={"icon-info"} />
          )}
        </button>
      </div>
      <div className="presence__date">
        <ButtonGroup buttons={["1M", "3M", "6M", "1Y", "calendrier"]} />
      </div>
      {Calendrier ? (
        <>
          <div className="calendrier" ref={node}>
            <DatePicker
              selected={startDate}
              onChange={onChange}
              startDate={startDate}
              endDate={endDate}
              minDate={dateMin}
              maxDate={dateMax}
              startOpen={setCalendrier}
              selectsRange
              inline
              showWeekNumbers
            />
            <div className="calendrier__footer">
              {rangeCalendar === 1
                ? "Sélectionnez au moins 2 jours."
                : !isNaN(rangeCalendar)
                ? "Sélectionnés : " + rangeCalendar + " jours"
                : ""}
            </div>
          </div>
        </>
      ) : (
        ""
      )}
      {InformationsCached === "false" || Informations ? (
        <>
          <div className="info__bloc">
            <div className="info__content">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
              standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a
              type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,
              remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing
              Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  )
}
