import React from "react"

/**
 * Return coworker information in a div
 * @param props
 */
function Coworker(props) {
  const nameArray = props.coworker.split(" ")
  const title = nameArray.shift()
  const justName = nameArray.join(" ")

  return (
    <div className="coworkers__coworker">
      <p className="coworker__name">
        <span className="coworker__name-title" style={{ color: props.color }}>
          {title}
        </span>
        {justName}
      </p>
    </div>
  )
}

export default Coworker
