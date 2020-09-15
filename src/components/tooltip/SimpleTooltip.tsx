import React from "react"

export interface ISimpleTooltip {
  content: string | number
  wasClicked?: boolean
}

/**
 *
 * @param {string|number} content Mandatory content of the tooltip as either text or number
 * @param {boolean} wasClicked Optional bool event/state to make the tooltip appear
 */
export default function SimpleTooltip(props: ISimpleTooltip) {
  return (
    <span
      className={`simple-tooltip ${
        props.wasClicked ? "simple-tooltip--visible" : null
      }`}
    >
      {props.content}
    </span>
  )
}
