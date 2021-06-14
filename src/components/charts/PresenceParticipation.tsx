import React, { useState, useEffect } from "react"
import orderBy from "lodash/orderBy"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import IconAgenda from "images/ui-kit/icon-agenda.svg"
import { Group } from "@visx/group"
import { curveMonotoneX } from "@visx/curve"
import { getNbActivitesMax } from "components/deputies-list/deputies-list-utils"
import dayjs from "dayjs"
import "dayjs/locale/fr"
import {
  XYChart,
  AnimatedAxis,
  AnimatedBarSeries,
  AnimatedGrid,
  AnimatedLineSeries,
  AnimatedAreaSeries,
  Tooltip,
} from "@visx/xychart"
import { Glyph as CustomGlyph, GlyphSquare } from "@visx/glyph"
import { Legend, LegendItem, LegendLabel } from "@visx/legend"
import { scaleOrdinal } from "@visx/scale"
import AugoraTooltip from "components/tooltip/Tooltip"

dayjs.locale("fr")

const getDates = (date: string) => {
  return {
    MonthData: dayjs(date).format("DD MMM YYYY"),
    MobileData: dayjs(date).format("DD/MM/YY"),
    DayData: dayjs(date).format("DD MMMM YYYY"),
  }
}

const getCalendarDates = (date: string) => {
  return {
    getDate: dayjs(date).toDate(),
  }
}

interface IPresence {
  width: number
  height: number
  data: Deputy.Activite[]
  color: string
}

const handleLegend = (state, legend: string) => {
  let newState = { ...state }
  const statesAsArray = Object.entries(newState)
  const allActive = statesAsArray.every(([key, value]) => value)
  const isClickedAloneActive =
    newState[legend] &&
    statesAsArray
      .filter(([key]) => {
        return key === legend
      })
      .every(([value]) => {
        return value
      })
  Object.keys(state).forEach((key) => {
    if (allActive) {
      newState[key] = key !== legend ? false : true
    } else if (isClickedAloneActive) {
      newState[key] = true
    } else {
      newState[key] = key !== legend ? false : true
    }
  })
  return newState
}

export default function PresenceParticipation(props: IPresence) {
  const [DisplayedGraph, setDisplayedGraph] = useState({
    Présences: true,
    Participations: true,
    "Questions orales": true,
    "Mediane des députés": true,
    Vacances: true,
  })

  const { width, height, data, color } = props
  const changeDisplay = width < 900
  const changeAxis = width < 1000
  const isRotate = width < 500
  const isMobile = width < 300
  const [DateButton, setDateButton] = useState(isMobile ? 2 : 3)
  const [Active, setActive] = useState(false)

  useEffect(() => {
    if (width < 300) {
      setDateButton(2)
    } else {
      setDateButton(3)
    }
  }, [width])
  const ButtonGroup = ({ buttons }) => {
    return (
      <>
        {buttons.map((buttonLabel, i) => (
          <button
            key={i}
            name={buttonLabel}
            onClick={() => {
              i <= 3 ? (setDateButton(i), setActive(false)) : (setDateButton(i), setActive(!Active))
            }}
            className={i === DateButton ? "button__active button" : "button"}
          >
            {i === 4 ? <IconAgenda className={"icon-agenda"} /> : buttonLabel}
          </button>
        ))}
      </>
    )
  }

  // bounds
  const marginTop = 50
  const marginPhone = 120
  const marginLeft = 20
  const xMax = width - marginLeft
  const yMax = changeDisplay ? height - marginPhone : height - marginTop
  var maxActivite = getNbActivitesMax(data) < 10 ? 10 : getNbActivitesMax(data)

  //const medianeArray = orderBy(mediane, "DateDeDebut")
  const animationTrajectoire = "center"
  const curveType = curveMonotoneX

  const vacancesColor = "rgba(77, 77, 77, 0.5)"
  const medianeDepute = "rgba(77, 77, 77, 0.3)"
  const opacityParticipation = 0.5

  const glyphSize = 120
  const glyphPosition = 8
  const shapeScale = scaleOrdinal<string, React.FC | React.ReactNode>({
    domain: ["Présences", "Participations", "Questions orales", "Mediane des députés", "Vacances"],
    range: [
      <CustomGlyph top={glyphPosition}>
        <line x1="0" y1="0" x2="12" y2="0" stroke={color} strokeWidth={4} opacity={DisplayedGraph.Présences ? 1 : 0.5} />
      </CustomGlyph>,
      <CustomGlyph top={glyphPosition}>
        <line
          x1="0"
          y1="0"
          x2="12"
          y2="0"
          stroke={color}
          strokeWidth={4}
          opacity={DisplayedGraph.Participations ? opacityParticipation : opacityParticipation / 2}
        />
      </CustomGlyph>,
      <GlyphSquare
        key="Questions orales"
        size={glyphSize}
        top={glyphPosition}
        left={glyphPosition}
        fill={color}
        opacity={DisplayedGraph["Questions orales"] ? 1 : 0.5}
      />,
      <GlyphSquare
        key="Mediane des députés"
        size={glyphSize}
        top={glyphPosition}
        left={glyphPosition}
        fill={medianeDepute}
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

  const onChange = (dates) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }
  // Activités triées par date de fin
  const orderedWeeks = orderBy(data, "DateDeFin")

  const dateMax = orderedWeeks.length != 0 ? getCalendarDates(orderedWeeks[orderedWeeks.length - 1].DateDeFin).getDate : ""
  const dateMin = orderedWeeks.length != 0 ? getCalendarDates(orderedWeeks[0].DateDeDebut).getDate : ""

  const [startDate, setStartDate] = useState(dateMax)
  const [endDate, setEndDate] = useState(null)

  const weekMin = Math.ceil((dayjs(dateMax).diff(startDate, "day") + 1) / 7)
  const weekMax = Math.ceil((dayjs(dateMax).diff(endDate, "day") + 1) / 7)

  const dayDebutRange = dayjs(startDate)
  const dayFinRange = dayjs(endDate)

  const rangeCalendar = dayFinRange.diff(dayDebutRange, "day") + 1

  const rangeOrderedWeeks =
    DateButton === 4
      ? weekMax
        ? orderedWeeks.slice(53 - weekMin, 53 - weekMax)
        : orderedWeeks
      : DateButton === 3
      ? orderedWeeks
      : DateButton === 2
      ? orderedWeeks.slice(27, 53)
      : DateButton === 1
      ? orderedWeeks.slice(40, 53)
      : orderedWeeks.slice(49, 53)

  return width < 10 ? null : (
    <div className="presence">
      <div className="presence__date">
        <ButtonGroup buttons={["1M", "3M", "6M", "1Y", "calendrier"]} />
      </div>
      {Active ? (
        <>
          <div className="calendrier">
            <DatePicker
              selected={startDate}
              onChange={onChange}
              startDate={startDate}
              endDate={endDate}
              minDate={dateMin}
              maxDate={dateMax}
              startOpen={setActive}
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
      <svg width={width} height={height}>
        <Group top={20} left={marginLeft}>
          <XYChart
            margin={{ top: 0, right: 10, bottom: 0, left: 0 }}
            width={width}
            height={changeDisplay ? height - marginPhone + marginTop : height}
            xScale={{ type: "band", range: [0, xMax] }}
            yScale={{ type: "linear", range: [0, yMax], padding: 0.1, domain: [maxActivite, 0] }}
          >
            <AnimatedGrid left={0} numTicks={maxActivite / 2} columns={false} />
            {DisplayedGraph.Vacances && (
              <AnimatedBarSeries
                dataKey={"Vacances"}
                data={rangeOrderedWeeks}
                xAccessor={(d) => d.DateDeFin}
                yAccessor={(d) => (d.Vacances ? maxActivite : 0)}
                colorAccessor={() => vacancesColor}
              />
            )}

            {/*
            {DisplayedGraph["Mediane des députés"] && (
            <AnimatedAreaSeries
              dataKey={"Mediane"}
              data={medianeArray}
              xAccessor={(d) => getDate(d).dateDebut}
              yAccessor={(d) => d.PresenceEnHemicycle + d.PresencesEnCommission}
              stroke={medianeDepute}
              fill={medianeDepute}
              renderLine={false}
              curve={curveType}
              opacity={opacityParticipation}
            />
            )} */}
            {DisplayedGraph.Participations && (
              <AnimatedLineSeries
                dataKey={"Participation"}
                data={rangeOrderedWeeks}
                xAccessor={(d) => d.DateDeFin}
                yAccessor={(d) => d.ParticipationEnHemicycle + d.ParticipationsEnCommission}
                curve={curveType}
                stroke={color}
                strokeOpacity={opacityParticipation}
              />
            )}
            {DisplayedGraph.Présences && (
              <AnimatedLineSeries
                dataKey={"Presence"}
                data={rangeOrderedWeeks}
                xAccessor={(d) => d.DateDeFin}
                yAccessor={(d) => d.PresenceEnHemicycle + d.PresencesEnCommission}
                stroke={color}
                curve={curveType}
              />
            )}
            {DisplayedGraph["Questions orales"] && (
              <AnimatedBarSeries
                dataKey={"Question"}
                data={rangeOrderedWeeks}
                xAccessor={(d) => d.DateDeFin}
                yAccessor={(d) => d.Question}
                colorAccessor={() => color}
              />
            )}

            <AnimatedAxis
              axisClassName="presence__axisleft"
              orientation="left"
              top={2}
              left={-8}
              hideAxisLine={true}
              tickStroke={"none"}
              tickLength={6}
              numTicks={maxActivite / 2}
              animationTrajectory={animationTrajectoire}
            />
            <AnimatedAxis
              axisClassName={isRotate ? " rotate" : ""}
              orientation="bottom"
              hideAxisLine={true}
              top={yMax}
              tickLength={6}
              numTicks={changeDisplay ? 8 : rangeOrderedWeeks.length / 4}
              animationTrajectory={animationTrajectoire}
              tickFormat={(date: string) =>
                changeAxis ? getDates(date.split("T")[0]).MobileData : getDates(date.split("T")[0]).MonthData
              }
            />
            <Tooltip<Deputy.Activite>
              className="charttooltip__container"
              applyPositionStyle={true}
              unstyled={true}
              snapTooltipToDatumX={true}
              offsetTop={-200}
              renderTooltip={({ tooltipData }) => {
                const key = tooltipData.nearestDatum.index
                const nearest = tooltipData.nearestDatum.datum
                return (
                  <AugoraTooltip
                    className="presence__tooltip"
                    title={`Semaine du ${getDates(nearest.DateDeDebut).DayData} au\n${getDates(nearest.DateDeFin).DayData}`}
                  >
                    {nearest.Vacances === 0 ? (
                      <Legend scale={shapeScale}>
                        {(labels) => (
                          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            {labels.map((label, i) => {
                              const shape = shapeScale(label.datum)
                              const isValidElement = React.isValidElement(shape)
                              // Passer à 3 pour intégrer la mediane dans la tooltip
                              return i > 2 ? (
                                ""
                              ) : (
                                <LegendItem className="item__tooltip" key={`legend-quantile-${i}`} flexDirection="row">
                                  <div className="legend__col">
                                    <svg width={25} height={25}>
                                      {isValidElement
                                        ? React.cloneElement(shape as React.ReactElement)
                                        : React.createElement(shape as React.ComponentType<{ fill: string }>, {
                                            fill: color,
                                          })}
                                    </svg>
                                    <LegendLabel className="label">
                                      {label.datum === "Questions orales"
                                        ? "Questions"
                                        : label.datum === "Mediane des députés"
                                        ? "Mediane"
                                        : label.text}
                                    </LegendLabel>
                                  </div>
                                  <div className="legend__col">
                                    <LegendLabel className="labelValue" align={"flex-end"}>
                                      {label.datum === "Présences"
                                        ? nearest.PresenceEnHemicycle + nearest.PresencesEnCommission != 0
                                          ? nearest.PresenceEnHemicycle + nearest.PresencesEnCommission
                                          : "0"
                                        : null}
                                      {label.datum === "Questions orales"
                                        ? nearest.Question != 0
                                          ? nearest.Question
                                          : "0"
                                        : null}
                                      {label.datum === "Participations"
                                        ? nearest.ParticipationEnHemicycle + nearest.ParticipationsEnCommission != 0
                                          ? nearest.ParticipationEnHemicycle + nearest.ParticipationsEnCommission
                                          : "0"
                                        : null}
                                      {label.datum === "Mediane" ? "0" : null}
                                    </LegendLabel>
                                  </div>
                                </LegendItem>
                              )
                            })}
                          </div>
                        )}
                      </Legend>
                    ) : (
                      <div className="legend__vacances">Vacances parlementaires</div>
                    )}
                  </AugoraTooltip>
                )
              }}
            />
          </XYChart>
        </Group>
      </svg>
      <div className="presence__filtre">
        <text>Filtrer</text>
      </div>
      <Legend scale={shapeScale}>
        {(labels) => (
          <div className="presence__legend">
            {labels.map((label, i) => {
              const shape = shapeScale(label.datum)
              const isValidElement = React.isValidElement(shape)
              return (
                <LegendItem
                  className="presence__legend-item item"
                  key={`legend-quantile-${i}`}
                  flexDirection="row"
                  margin="0 10px"
                  onClick={() => {
                    label.text !== "Mediane des députés" && label.text !== "Vacances"
                      ? setDisplayedGraph(handleLegend(DisplayedGraph, label.text))
                      : null
                  }}
                >
                  <svg width={25} height={25}>
                    {isValidElement
                      ? React.cloneElement(shape as React.ReactElement)
                      : React.createElement(shape as React.ComponentType<{ fill: string }>, {
                          fill: color,
                        })}
                  </svg>
                  <LegendLabel
                    className="item__label"
                    style={{ margin: "0 0 12px", textDecoration: !DisplayedGraph[label.text] ? "line-through" : "" }}
                  >
                    {label.text}
                  </LegendLabel>
                </LegendItem>
              )
            })}
          </div>
        )}
      </Legend>
    </div>
  )
}
