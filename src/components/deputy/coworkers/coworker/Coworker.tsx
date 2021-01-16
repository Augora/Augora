import React from "react"

interface ICoworker {
  coworker: string
  color: string
  isCompact?: boolean
}

/**
 * Return coworker information in a div
 * @param props
 */
function Coworker(props: ICoworker) {
  const nameArray = props.coworker.split(" ")
  const title = nameArray.shift()
  const justName = nameArray.join(" ").toLowerCase()

  return (
    <div className={`cowoerkers__coworker ${props.isCompact ? "coworkers__coworker--compact" : null}`}>
      <p className="coworker__name">
        <span className="coworker__name-title" style={{ color: props.color }}>
          {title}
        </span>
        <span className="coworker__name-content">{justName}</span>
      </p>
    </div>
  )
}

export default Coworker
