import React from "react"
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider"

const barHeight = 10
const marginTop = 35
const handleSize = 25

const sliderStyle = {
  // Give the slider some width
  position: "absolute",
  width: "calc(95%)",
  height: 80,
  right: "2.5%",
  bottom: -40,
  pointerEvents: "none",
  zIndex: 10,
}
const railStyle = {
  position: "absolute",
  width: "100%",
  height: barHeight,
  marginTop: 35,
  borderRadius: 5,
  backgroundColor: "#8B9CB6",
}

const Track = ({ source, target, getTrackProps }) => {
  return (
    <div
      style={{
        position: "absolute",
        height: barHeight,
        zIndex: 1,
        marginTop: marginTop,
        backgroundColor: "#546C91",
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
        zIndex: 2,
        width: handleSize,
        height: handleSize,
        border: 0,
        textAlign: "center",
        cursor: "pointer",
        borderRadius: "50%",
        backgroundColor: "#2C4870",
        color: "#333",
        pointerEvents: "all",
      }}
      {...getHandleProps(id)}
    >
      <div
        style={{
          fontFamily:
            "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
          fontSize: 12,
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
          marginTop: 42,
          marginLeft: -0.5,
          width: 1,
          height: 8,
          backgroundColor: "silver",
          left: `${tick.percent}%`,
        }}
      />
      <div
        style={{
          fontFamily:
            "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
          position: "absolute",
          marginTop: 50,
          fontSize: 10,
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
      rootStyle={sliderStyle}
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
      <Ticks
        count={
          props.domain[1] -
          props
            .domain[0] /* generate approximately 15 ticks within the domain */
        }
      >
        {({ ticks }) => (
          <div className="slider-ticks">
            {ticks.map((tick) => (
              <Tick key={tick.id} tick={tick} count={ticks.length} />
            ))}
          </div>
        )}
      </Ticks>
    </Slider>
  )
}
