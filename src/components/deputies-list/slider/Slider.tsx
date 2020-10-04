import React from "react"
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider"

const barHeight = 12
const marginTop = 25
const handleSize = 32

const railStyle = {
  position: "absolute",
  width: "100%",
  height: barHeight,
  marginTop: marginTop,
  borderRadius: 20,
  backgroundColor: "white",
} as React.CSSProperties

const Track = ({ source, target, getTrackProps }) => {
  return (
    <div
      style={{
        position: "absolute",
        height: barHeight,
        marginTop: marginTop,
        backgroundColor: "#4d4d4d",
        borderRadius: 5,
        cursor: "pointer",
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`,
      }}
    />
  )
}
const Handle = ({ handle: { id, value, percent }, getHandleProps }) => {
  return (
    <div
      style={{
        left: `${percent}%`,
        position: "absolute",
        marginLeft: -handleSize / 2,
        marginTop: marginTop - handleSize / 2 + barHeight / 2,
        zIndex: 1,
        width: handleSize,
        height: handleSize,
        border: 0,
        textAlign: "center",
        cursor: "pointer",
        borderRadius: "50%",
        backgroundColor: "#4d4d4d",
        color: "#333",
        pointerEvents: "all",
      }}
      {...getHandleProps(id)}
    >
      <div
        style={{
          fontFamily: "Open Sans, sans-serif",
          fontSize: 16,
          position: "absolute",
          top: "50%",
          left: "50%",
          color: "white",
          fontWeight: "bold",
          transform: "translate(-50%, -50%)",
        }}
      >
        {value}
      </div>
    </div>
  )
}
const Tick = ({ tick, count }) => {
  return (
    <div>
      <div
        style={{
          position: "absolute",
          marginTop: 37,
          marginLeft: -0.5,
          width: 1,
          height: 8,
          backgroundColor: "silver",
          left: `${tick.percent}%`,
        }}
      />
      <div
        style={{
          fontFamily: "Open Sans, sans-serif",
          position: "absolute",
          marginTop: 45,
          fontSize: 14,
          textAlign: "center",
          marginLeft: `${-(100 / count) / 2}%`,
          width: `${100 / count}%`,
          left: `${tick.percent}%`,
        }}
      >
        {tick.value}
      </div>
    </div>
  )
}

export default function AgeSlider(props) {
  return (
    <Slider
      className="filters__slider"
      domain={props.domain}
      step={1}
      mode={2}
      values={props.selectedDomain}
      onChange={(e) => props.callback(e)}
    >
      <Rail>
        {({ getRailProps }) => <div style={railStyle} {...getRailProps()} />}
      </Rail>
      <Handles>
        {({ handles, getHandleProps }) => (
          <div className="slider-handles">
            {handles.map((handle) => (
              <Handle
                key={handle.id}
                handle={handle}
                getHandleProps={getHandleProps}
              />
            ))}
          </div>
        )}
      </Handles>
      <Tracks left={false} right={false}>
        {({ tracks, getTrackProps }) => (
          <div className="slider-tracks">
            {tracks.map(({ id, source, target }) => (
              <Track
                key={id}
                source={source}
                target={target}
                getTrackProps={getTrackProps}
              />
            ))}
          </div>
        )}
      </Tracks>
      {props.children}
    </Slider>
  )
}

// <Ticks
//   // count={
//   //   window.innerWidth > 1500
//   //     ? props.domain[1] -
//   //       props
//   //         .domain[0] /* generate approximately 15 ticks within the domain */
//   //     : 10
//   // }
//   count={10}
// >
//   {({ ticks }) => (
//     <div className="slider-ticks">
//       {ticks.map((tick) => (
//         <Tick key={tick.id} tick={tick} count={ticks.length} />
//       ))}
//     </div>
//   )}
// </Ticks>
