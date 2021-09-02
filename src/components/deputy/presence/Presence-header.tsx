import React, { useState, useEffect, useRef } from "react"

import IconAgenda from "images/ui-kit/icon-agenda.svg"
import IconInfo from "images/ui-kit/icon-info.svg"
import IconClose from "images/ui-kit/icon-close.svg"

interface IPresenceHeader {
  width: number
  data: Deputy.Activite[]
  setRange: React.Dispatch<React.SetStateAction<Deputy.Activite[]>>
}

export default function PresenceHeader(props: IPresenceHeader) {
  var { width, data, setRange } = props

  const isMobile = width < 300
  const [Calendrier, setCalendrier] = useState(false)
  const [DateButton, setDateButton] = useState(isMobile ? 1 : 2)
  const [Informations, setInformations] = useState(false)
  const [InformationsCached, setInformationsCached] = useState(undefined)

  useEffect(() => {
    if (localStorage.getItem("informations.Autorisation") === null) {
      localStorage.setItem("informations.Autorisation", "false")
      setInformations(true)
    }
    setInformationsCached(localStorage.getItem("informations.Autorisation"))
  }, [])

  useEffect(() => {
    if (isMobile) {
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
        {buttons.map((buttonLabel, i) => (
          <button
            key={i}
            name={buttonLabel}
            onClick={() => setDateButton(i)}
            className={i === DateButton ? "button__active button" : "button"}
          >
            {buttonLabel}
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
        <ButtonGroup buttons={["3M", "6M", "1Y"]} />
      </div>
      {InformationsCached === "false" || Informations ? (
        <>
          <div className="info__bloc">
            <div className="info__content">
              Le rôle d'un député n'est pas d'être présent à toutes les séances de l'Assemblée Nationale. En amont, ils préparent
              dans des commissions parlementaires les amendements, les propositions de loi. Ils ont également des missions
              d'informations et des groupes d'études. Si un vote a lieu dans l'hémicycle qui n'a pas de rapport avec les
              spécialités d'un député, il peut se concentrer sur sa commission.
              <br />
              Pour l'ensemble des ces organes parlementaires, il y a des responsables. Un député qui sera simplement membre de ces
              différents organes aura donc potentiellement plus de latitude pour participer.
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  )
}
