import React, { useState } from "react"
import Image from "next/image"

const MissingFemale = "/images/ui-kit/icon-missingfemale.svg"
const MissingMale = "/images/ui-kit/icon-missingmale.svg"

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
      return MissingMale
    case "F":
      return MissingFemale
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
  const [Src, setSrc] = useState(props.src)
  const [HasErrored, setHasErrored] = useState(false)

  function onError() {
    // Prevent modifying state on error loop
    if (!HasErrored) {
      setHasErrored(true)
      setSrc(DeputyDefaultPlaceholder(props.sex))
    }
  }

  return (
    <Image
      className={HasErrored ? "icon-wrapper deputy__photo deputy__photo--errored" : "deputy__photo"}
      src={Src}
      alt={props.alt}
      placeholder={"blur"}
      blurDataURL={DeputyDefaultPlaceholder(props.sex)}
      width={150}
      height={192}
      onError={() => onError()}
    />
  )
}

export interface IDeputyImageInformation {
  src: string
  alt: string
  sex: string
}
