import React, { useState } from "react"
import Block from "../_block/_Block"
import PresenceParticipation from "src/components/charts/PresenceParticipation"
import PresenceHeader from "./Presence-header"
import PresenceFooter from "./Presence-footer"
import { orderBy } from "lodash"
import { ParentSize } from "@visx/responsive"
import { Glyph as CustomGlyph, GlyphSquare } from "@visx/glyph"
import { scaleOrdinal } from "@visx/scale"

/**
 * Return deputy's presence and participation graph in a Block component
 * @param {*} props
 */

const Presence = (props: Bloc.Presence) => {
  const orderedWeeks = orderBy(props.activite, "DateDeFin")
  const [RangeOrderedWeeks, setRangeOrderedWeeks] = useState(orderedWeeks)

  const [DisplayedGraph, setDisplayedGraph] = useState({
    Présences: true,
    Participations: true,
    "Questions orales": true,
    "Mediane des députés": true,
    Vacances: true,
  })

  const medianeDeputeColor = "rgba(77, 77, 77, 0.3)"
  const vacancesColor = "rgba(77, 77, 77, 0.5)"

  const opacityParticipation = 0.5
  const glyphSize = 120
  const glyphPosition = 8
  const shapeScale = scaleOrdinal<string, React.FC | React.ReactNode>({
    domain: ["Présences", "Participations", "Questions orales", "Mediane des députés", "Vacances"],
    range: [
      <CustomGlyph top={glyphPosition}>
        <line
          x1="0"
          y1="0"
          x2="12"
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
          x2="12"
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
        opacity={DisplayedGraph["Mediane des députés"] ? 1 : 0.5}
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
    <Block title="Présence et participation" type="presence" color={props.color} size={props.size} wip={props.wip}>
      <ParentSize debounceTime={400}>
        {(parent) => (
          <>
            {orderedWeeks.length != 0 ? (
              <div className="presence">
                <PresenceHeader width={parent.width} data={orderedWeeks} setRange={setRangeOrderedWeeks} />
                <PresenceParticipation
                  width={parent.width}
                  height={parent.height * 0.9}
                  data={orderedWeeks}
                  slicedData={RangeOrderedWeeks}
                  color={props.color.HSL.Full}
                  opacityParticipation={opacityParticipation}
                  DisplayedGraph={DisplayedGraph}
                  medianeDeputeColor={medianeDeputeColor}
                  vacancesColor={vacancesColor}
                  shapeScale={shapeScale}
                />
                <PresenceFooter
                  width={parent.width}
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
