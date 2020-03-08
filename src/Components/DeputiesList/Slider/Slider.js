import React from "react"
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider"

const sliderStyle = {
  // Give the slider some width
  position: "relative",
  width: "100%",
  height: 80,
}
const railStyle = {
  position: "absolute",
  width: "100%",
  height: 10,
  marginTop: 35,
  borderRadius: 5,
  backgroundColor: "#8B9CB6",
}

const Track = ({ source, target, getTrackProps }) => {
  return (
    <div
      style={{
        position: "absolute",
        height: 10,
        zIndex: 1,
        marginTop: 35,
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
        marginLeft: -15,
        marginTop: 25,
        zIndex: 2,
        width: 30,
        height: 30,
        border: 0,
        textAlign: "center",
        cursor: "pointer",
        borderRadius: "50%",
        backgroundColor: "#2C4870",
        color: "#333",
      }}
      {...getHandleProps(id)}
    >
      <div
        style={{
          fontFamily:
            "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
          fontSize: 11,
          marginTop: -25,
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
      onChange={e => props.callback(e)}
    >
      <Rail>
        {({ getRailProps }) => <div style={railStyle} {...getRailProps()} />}
      </Rail>
      <Handles>
        {({ handles, getHandleProps }) => (
          <div className="slider-handles">
            {handles.map(handle => (
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
      <Ticks count={15 /* generate approximately 15 ticks within the domain */}>
        {({ ticks }) => (
          <div className="slider-ticks">
            {ticks.map(tick => (
              <Tick key={tick.id} tick={tick} count={ticks.length} />
            ))}
          </div>
        )}
      </Ticks>
    </Slider>
  )
}
