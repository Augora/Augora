import React from "react"

interface IMission {
  nom: string
  color: string
  isCompact?: boolean
}

/**
 * Return coworker information in a div
 * @param props
 */
function Mission(props: IMission) {
  const nomMission = props.nom

  return (
    <div className="missions__bloc">
      <div className="missions__nom">{nomMission}</div>
      <div className="missions__responsabilite" style={{ color: props.color }}>
        Vice-Présidente
      </div>
    </div>
  )
}

export default Mission
