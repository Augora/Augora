import React from "react"

/**
 * Return coworker information in a div
 * @param props
 */
function Coworker(props) {
  const nameArray = props.coworker.split(" ")
  const title = nameArray.shift()
  const justName = nameArray.join(" ").toLowerCase()

  return (
    <div
      className={`cowoerkers__coworker ${
        props.isCompact ? "coworkers__coworker--compact" : null
      }`}
    >
      <p className="coworker__name">
        <span className="coworker__name-title" style={{ color: props.color }}>
          {title}
          {/* {props.isCompact ? "&nbsp;" : null} */}
        </span>
        <span className="coworker__name-content">{justName}</span>
      </p>
    </div>
  )
}

export default Coworker
