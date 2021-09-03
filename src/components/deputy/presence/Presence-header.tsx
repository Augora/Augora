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
              <p>
                Le rôle d'un député ne se réduit pas seulement à sa présence aux séances de l'Assemblée Nationale. Si un vote a
                lieu dans l'hémicycle qui n'a pas de rapport avec ses spécialités, il peut se concentrer sur d'autres activités,
                telles que la préparation des {InformationLink("amendements")} et des {InformationLink("propositions de loi")}.
                Ces activités se déroulent dans le cadre de {InformationLink("commissions parlementaires")}. Ils ont également des{" "}
                {InformationLink("missions d'information")} et des {InformationLink("groupes d'études")}.
              </p>
              <p>
                Selon sa responsabilité au sein de ces organes parlementaires (membre, président, etc.), le député aura plus ou
                moins de temps à consacrer à sa participation dans l'hémicycle.
              </p>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  )
}
