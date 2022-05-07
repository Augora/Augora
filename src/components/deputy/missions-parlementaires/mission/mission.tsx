import React from "react"

interface IMission {
  nom: string
  fonction: string
  color: string
  permanente: boolean
}

/**
 * Return coworker information in a div
 * @param props
 */
function Mission(props: IMission) {
  return (
    <div className="missions__bloc">
      <div className="missions__nom">{props.nom}</div>
      <div className="missions__responsabilite" style={{ color: props.color }}>
        {props.fonction}
      </div>
    </div>
  )
}

export default Mission
