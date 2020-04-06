import React from "react"

/**
 * Return coworker information in a div
 * @param props
 */
function Coworker(props) {
  const nameArray = props.coworker.split(" ")
  return (
    <div className="coworkers__coworker">
      <p className="coworker__name">
        <span className="coworker__name-title" style={{ color: props.color }}>
          {nameArray[0]}
        </span>
        {nameArray[1]} {nameArray[2]}
      </p>
    </div>
  )
}

export default Coworker
