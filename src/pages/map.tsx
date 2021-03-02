import React, { useState } from "react"
import MapAugora from "components/maps/MapAugora"
import { getDeputes } from "../lib/deputes/Wrapper"
import { useRouter } from "next/router"
import SEO, { PageType } from "src/components/seo/seo"

function convertArrayOfStringToString(arr: string | string[]) {
  if (arr instanceof Array) {
    return arr[0]
  }
  return arr
}

function stringToInt(n: string) {
  const parsedString = parseInt(n)
  if (isNaN(parsedString)) {
    return undefined
  }
  return parsedString
}

export default function MapPage({
  location,
}: {
  location: {
    search: string
  }
}) {
  const [pageTitle, setPageTitle] = useState<string>("Carte du monde")
  const router = useRouter()

  return (
    <>
      <SEO pageType={PageType.Carte} title={pageTitle} />
      <div className="page page__map">
        <div className="map__container">
          <MapAugora
            codeCont={stringToInt(convertArrayOfStringToString(router.query.codeCont))}
            codeDpt={convertArrayOfStringToString(router.query.codeDpt)}
            codeReg={convertArrayOfStringToString(router.query.codeReg)}
            setPageTitle={setPageTitle}
          />
        </div>
      </div>
    </>
  )
}

export async function getStaticProps() {
  const deputes = await getDeputes()

  return {
    props: {
      deputes,
    },
  }
}
