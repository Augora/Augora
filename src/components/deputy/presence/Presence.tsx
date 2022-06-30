import React, { useState } from "react"
import Block from "../_block/_Block"
import PresenceParticipation from "src/components/charts/PresenceParticipation"
import PresenceHeader from "./Presence-header"
import PresenceFooter from "./Presence-footer"
import { orderBy } from "lodash"
import { ParentSize } from "@visx/responsive"
import { Glyph as CustomGlyph, GlyphSquare } from "@visx/glyph"
import { scaleOrdinal } from "@visx/scale"
import FAQLink from "components/faq/Liens-faq"

/**
 * Return deputy's presence and participation graph in a Block component
 * @param {*} props
 */
const Presence = (props: Bloc.Presence) => {
  const orderedWeeks = orderBy(props.activite, "DateDeFin")
  const slicedOrderedWeeks =
    orderedWeeks.length > 52 ? orderedWeeks.slice(orderedWeeks.length - 52, orderedWeeks.length) : orderedWeeks
  const [RangeOrderedWeeks, setRangeOrderedWeeks] = useState(slicedOrderedWeeks)

  const [DisplayedGraph, setDisplayedGraph] = useState({
    Présences: true,
    Participations: true,
    "Questions orales": true,
    "Mediane des présences": true,
    Vacances: true,
  })
  const medianeDeputeColor = "rgba(77, 77, 77, 0.3)"
  const vacancesColor = "rgba(77, 77, 77, 0.5)"

  const opacityParticipation = 0.5
  const glyphSize = 120
  const glyphPosition = 8
  const shapeScale = scaleOrdinal<string, React.FC | React.ReactNode>({
    domain: ["Présences", "Participations", "Questions orales", "Mediane des présences", "Vacances"],
    range: [
      <CustomGlyph top={glyphPosition}>
        <line
          x1="0"
          y1="0"
          x2="11"
          y2="0"
          stroke={props.color.HSL.Full}
          strokeWidth={4}
          opacity={DisplayedGraph.Présences ? 1 : 0.5}
        />
      </CustomGlyph>,
      <CustomGlyph top={glyphPosition}>
        <line
          x1="0"
          y1="0"
          x2="11"
          y2="0"
          stroke={props.color.HSL.Full}
          strokeWidth={4}
          opacity={DisplayedGraph.Participations ? opacityParticipation : opacityParticipation / 2}
        />
      </CustomGlyph>,
      <GlyphSquare
        key="Questions orales"
        size={glyphSize}
        top={glyphPosition}
        left={glyphPosition}
        fill={props.color.HSL.Full}
        opacity={DisplayedGraph["Questions orales"] ? 1 : 0.5}
      />,
      <GlyphSquare
        key="Mediane des députés"
        size={glyphSize}
        top={glyphPosition}
        left={glyphPosition}
        fill={medianeDeputeColor}
        opacity={DisplayedGraph["Mediane des présences"] ? 1 : 0.5}
      />,
      <GlyphSquare
        key="Vacances"
        size={glyphSize}
        top={glyphPosition}
        left={glyphPosition}
        fill={vacancesColor}
        opacity={DisplayedGraph.Vacances ? 1 : 0.5}
      />,
    ],
  })

  return (
    <Block
      title="Présence et participation"
      type="presence"
      color={props.color}
      size={props.size}
      wip={props.wip}
      info={
        <p>
          Le rôle d'un député ne se réduit pas seulement à sa présence aux séances de l'Assemblée Nationale. Si un vote a lieu
          dans l'hémicycle qui n'a pas de rapport avec ses spécialités, il peut se concentrer sur d'autres activités, telles que
          la préparation des{" "}
          {
            <FAQLink link={"quest-ce-quun-amendement"} colorHSL={props.color.HSL.Full}>
              amendements
            </FAQLink>
          }{" "}
          et des propositions de loi. Ces activités se déroulent dans le cadre de{" "}
          {
            <FAQLink link={"quest-ce-quune-commission-parlementaire"} colorHSL={props.color.HSL.Full}>
              commissions parlementaires
            </FAQLink>
          }
          . Ils ont également des{" "}
          {
            <FAQLink link={"quest-ce-quune-commission-denquete"} colorHSL={props.color.HSL.Full}>
              commissions d'enquête
            </FAQLink>
          }
          ,{" "}
          {
            <FAQLink link={"quest-ce-quune-mission-dinformation"} colorHSL={props.color.HSL.Full}>
              missions d'information
            </FAQLink>
          }{" "}
          et des{" "}
          {
            <FAQLink link={"quest-ce-quun-groupe-detude"} colorHSL={props.color.HSL.Full}>
              groupes d'études
            </FAQLink>
          }
          .
          <br />
          <br />
          Selon sa responsabilité au sein de ces organes parlementaires (membre, président, etc.), le député aura plus ou moins de
          temps à consacrer à sa participation dans l'hémicycle.
        </p>
      }
      isLockedByDefault={true}
    >
      <ParentSize debounceTime={400}>
        {(parent) => (
          <>
            {orderedWeeks.length != 0 ? (
              <div className="presence">
                {orderedWeeks.length > 14 ? (
                  <PresenceHeader
                    width={parent.width}
                    data={slicedOrderedWeeks}
                    setRange={setRangeOrderedWeeks}
                    color={props.color.HSL.Full}
                  />
                ) : (
                  ""
                )}
                <PresenceParticipation
                  width={parent.width}
                  height={parent.height * (parent.width > 370 ? 0.9 : 0.8)}
                  data={slicedOrderedWeeks}
                  slicedData={RangeOrderedWeeks}
                  color={props.color.HSL.Full}
                  opacityParticipation={opacityParticipation}
                  DisplayedGraph={DisplayedGraph}
                  medianeDeputeColor={medianeDeputeColor}
                  vacancesColor={vacancesColor}
                  shapeScale={shapeScale}
                />
                <PresenceFooter
                  color={props.color.HSL.Full}
                  DisplayedGraph={DisplayedGraph}
                  setDisplayedGraph={setDisplayedGraph}
                  shapeScale={shapeScale}
                />
              </div>
            ) : (
              <div className="presence__indisponible">Les données ne sont pour le moment pas disponibles.</div>
            )}
          </>
        )}
      </ParentSize>
    </Block>
  )
}

export default Presence
