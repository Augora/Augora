import React, { useState, useEffect } from "react"

interface IPresenceHeader {
  width: number
  data: Deputy.Activite[]
  setRange: React.Dispatch<React.SetStateAction<Deputy.Activite[]>>
  color: string
}

export default function PresenceHeader(props: IPresenceHeader) {
  var { width, data, setRange, color } = props

  const isMobile = width < 300
  const [DateButton, setDateButton] = useState(isMobile ? 1 : 2)

  useEffect(() => {
    if (data.length < 14) {
      // 3 mois
      setDateButton(0)
    } else if (data.length < 27) {
      // 6 mois
      setDateButton(1)
    } else if (isMobile) {
      setDateButton(1)
    } else {
      setDateButton(2)
    }
  }, [width])

  useEffect(() => {
    if (DateButton === 2) {
      setRange(data)
    } else if (DateButton === 1) {
      setRange(data.slice(27, 53))
    } else {
      setRange(data.slice(40, 53))
    }
  }, [DateButton])

  const ButtonGroup = ({ buttons }) => {
    return (
      <>
        {buttons.map((buttonLabel, i) => {
          const active = i === DateButton
          return (
            <button
              key={i}
              name={buttonLabel}
              onClick={() => setDateButton(i)}
              className={`button${active ? " button__active" : ""}`}
              style={active ? { backgroundColor: color } : {}}
            >
              <div
                className="button__border"
                style={{
                  border: `solid 1px ${color}`,
                }}
              />
              <div
                className="button__background"
                style={{
                  backgroundColor: color,
                }}
              />
              <span style={{ color: active ? "white" : color }}>{buttonLabel}</span>
            </button>
          )
        })}
      </>
    )
  }

  return (
    <div>
      <div className="presence__date">
        <ButtonGroup buttons={["3 mois", "6 mois", "1 an"]} />
      </div>
    </div>
  )
}
