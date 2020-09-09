import React, { useState } from "react"
import MissingFemale from "images/ui-kit/icon-missingfemale.svg"
import MissingMale from "images/ui-kit/icon-missingmale.svg"
import { ReactComponentElement } from "react"

/**
 * Retrieve default Component deputy's placeholder
 *
 * @export
 * @param {string} sex
 * @returns
 */
export function DeputyDefaultPlaceholder(sex: string) {
  switch (sex) {
    case "H":
      return <MissingMale />
    case "F":
      return <MissingFemale />
    default:
      return ""
  }
}

/**
 * Return deputy's image in img or div>svg tag
 *
 * @export
 * @param {IDeputyImageInformation} props
 * @returns <img> deputy image </img>
 */
export default function DeputyImage(props: IDeputyImageInformation) {
  const [tag, setTag] = useState(
    <img
      className="deputy__photo"
      src={props.src}
      alt={props.alt}
      onError={() => onError()}
    />
  )

  function onError() {
    setTag(
      <div className="icon-wrapper deputy__photo deputy__photo--errored">
        {DeputyDefaultPlaceholder(props.sex)}
      </div>
    )
  }

  return tag
}

export interface IDeputyImageInformation {
  src: string
  alt: string
  sex: string
}
