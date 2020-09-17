import React from "react"

export interface IListFrame {
  children?: React.ReactNode
  title: string
  center?: string
  right?: string
  minWidth?: number | string
  margin?: number | string
}

export default function ListFrame(props: IListFrame) {
  return (
    <div
      className="list-frame"
      style={{
        minWidth: props.minWidth ? props.minWidth : "",
        margin: props.margin ? props.margin : "",
      }}
    >
      <div className="list-frame__header">
        <span className="list-frame__header-title">{props.title}</span>
        {props.center ? (
          <span className="list-frame__header-center">{props.center}</span>
        ) : null}
        {props.right ? (
          <span className="list-frame__header-right">{props.right}</span>
        ) : null}
      </div>
      {props.children ? props.children : null}
    </div>
  )
}
