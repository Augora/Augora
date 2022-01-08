import React, { useState, useEffect, useRef } from "react"

import IconAgenda from "images/ui-kit/icon-agenda.svg"
import IconInfo from "images/ui-kit/icon-info.svg"
import IconClose from "images/ui-kit/icon-close.svg"

interface IPresenceHeader {
  width: number
  data: Deputy.Activite[]
  setRange: React.Dispatch<React.SetStateAction<Deputy.Activite[]>>
  color: string
}

export default function PresenceHeader(props: IPresenceHeader) {
  var { width, data, setRange, color } = props

  const InformationLink = (label: string, link: string) => {
    return (
      <a href={`/faq#${link}`} style={{ color: color }}>
        {label}
      </a>
    )
  }

  const isMobile = width < 300
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
              >
                {/* Silence is golden */}
              </div>
              <div
                className="button__background"
                style={{
                  backgroundColor: color,
                }}
              >
                {/* Silence is golden */}
              </div>
              <span style={{ color: active ? "white" : color }}>{buttonLabel}</span>
            </button>
          )
        })}
      </>
    )
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
        <ButtonGroup buttons={["3 mois", "6 mois", "1 an"]} />
      </div>
      {InformationsCached === "false" || Informations ? (
        <>
          <div className="info__bloc">
            <div className="info__content">
              <p>
                Le rôle d'un député ne se réduit pas seulement à sa présence aux séances de l'Assemblée Nationale. Si un vote a
                lieu dans l'hémicycle qui n'a pas de rapport avec ses spécialités, il peut se concentrer sur d'autres activités,
                telles que la préparation des {InformationLink("amendements", "quest-ce-quun-amendement")} et des propositions de
                loi. Ces activités se déroulent dans le cadre de{" "}
                {InformationLink("commissions parlementaires", "quest-ce-quune-commission-parlementaire")}. Ils ont également des{" "}
                {InformationLink("commissions d'enquête", "quest-ce-quune-commission-denquete")},{" "}
                {InformationLink("missions d'information", "quest-ce-quune-mission-dinformation")} et des{" "}
                {InformationLink("groupes d'études", "quest-ce-quun-groupe-detude")}.
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
