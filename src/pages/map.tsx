import React, { useState } from "react"
import { Helmet } from "react-helmet"
import MapAugora from "components/maps/MapAugora"
import { getDeputes } from "../lib/deputes/Wrapper"
import { useRouter } from "next/router"

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
  const [pageTitle, setPageTitle] = useState<string>("Carte")
  const router = useRouter()

  return (
    <>
      <Helmet>
        {process.env.NEXT_PUBLIC_ENV !== "production" ? <meta name="robots" content="noindex,nofollow" /> : null}
        <title>{`${pageTitle} | Augora`}</title>
      </Helmet>
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
