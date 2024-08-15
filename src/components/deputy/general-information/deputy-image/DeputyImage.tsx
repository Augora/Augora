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

async function checkIfUrlExists(url: string, setSrc: React.Dispatch<React.SetStateAction<string>>, placeholder: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'HEAD'
    })
    return response.status !== 404
  } catch (error) {
    setSrc(DeputyDefaultPlaceholder(placeholder))
    return false
  }
}

export default function DeputyImage(props: IDeputyImageInformation) {
  const [Src, setSrc] = useState(props.src)

  const [HasErrored, setHasErrored] = useState(false)

  function onError() {
    if (!HasErrored) {
      setHasErrored(true)
      checkIfUrlExists(Src, setSrc, props.sex)
    }
  }

  return (
    <Image
      className={HasErrored ? "icon-wrapper deputy__photo deputy__photo--errored" : "deputy__photo"}
      src={Src}
      alt={props.alt}
      placeholder={"blur"}
      blurDataURL={DeputyDefaultPlaceholder(props.sex)}
      unoptimized={HasErrored}
      width={150}
      height={192}
      onError={onError}
    />
  )
}

export interface IDeputyImageInformation {
  src: string
  alt: string
  sex: string
}
