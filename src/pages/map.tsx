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

  return (
    <>
      <SEO pageType={PageType.Map} title={pageTitle} />
      <div className="page page__map">
        <div className="map__container">
          <MapAugora
            deputies={FilteredList}
            codes={{
              cont: stringToInt(convertArrayOfStringToString(router.query.cont)),
              dpt: convertArrayOfStringToString(router.query.dpt),
              reg: convertArrayOfStringToString(router.query.reg),
              circ: stringToInt(convertArrayOfStringToString(router.query.circ)),
            }}
            setPageTitle={setPageTitle}
            changeURL={changeURL}
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
