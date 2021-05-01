import React, { useState } from "react"
import MapAugora from "components/maps/MapAugora"
import { getDeputes } from "../lib/deputes/Wrapper"
import { useRouter } from "next/router"
import SEO, { PageType } from "src/components/seo/seo"
import useDeputiesFilters from "src/hooks/deputies-filters/useDeputiesFilters"

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

export default function MapPage() {
  const [pageTitle, setPageTitle] = useState<string>("Carte")
  const router = useRouter()

  const {
    state: { FilteredList },
  } = useDeputiesFilters()

  const changeURL = (URL: string) => {
    router.push(URL, URL, { shallow: true })
  }

  const buildCodes = (query) => {
    let codes: AugoraMap.Codes = {}
    if (query.circ) codes.code_circ = stringToInt(query.circ)
    if (query.dpt) codes.code_dpt = query.dpt
    if (query.reg) codes.code_reg = query.reg
    if (query.cont) codes.code_cont = stringToInt(query.cont)
    return codes
  }

  return (
    <>
      <SEO pageType={PageType.Map} title={pageTitle} />
      <div className="page page__map">
        <div className="map__container">
          <MapAugora deputies={FilteredList} codes={buildCodes(router.query)} setPageTitle={setPageTitle} changeURL={changeURL} />
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
