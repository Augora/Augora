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

async function checkIfUrlExists(url: string, setSrc: React.Dispatch<React.SetStateAction<string>>, placeholder: string, setIsPlaceholder: React.Dispatch<React.SetStateAction<boolean>>) {
  fetch(`/api/check-image-status?url=${encodeURIComponent(url)}`)
    .then(response => response.json())
    .then(data => {
      if (data.status === 404) {
        setIsPlaceholder(true)
        setSrc(DeputyDefaultPlaceholder(placeholder))
      }
    })
    .catch(error => console.error('Fetch error:', error))
}

export default function DeputyImage(props: IDeputyImageInformation) {
  const [Src, setSrc] = useState(props.src)
  const [HasErrored, setHasErrored] = useState(false)
  const [IsPlaceholder, setIsPlaceholder] = useState(false)

  function onError() {
    setHasErrored(true)
    checkIfUrlExists(Src, setSrc, props.sex, setIsPlaceholder)
  }

  return (
    <Image
      className={IsPlaceholder ? "icon-wrapper deputy__photo deputy__photo--errored" : "deputy__photo"}
      src={Src}
      alt={props.alt}
      placeholder={"blur"}
      unoptimized={HasErrored}
      blurDataURL={DeputyDefaultPlaceholder(props.sex)}
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
