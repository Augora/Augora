import React from "react"
import { fetchQuery } from 'utils/utils';
import { getDeputeAccropolis } from "../lib/deputes/Wrapper"

export default function Accropolis(props) {
  return (
    <></>
  )
}

async function getServerSideProps(context) {
  const strapiDeputes = await fetchQuery('deputes')
  const accroDeputes = await Promise.all(strapiDeputes.map(async depute => {
    return await getDeputeAccropolis(depute.Depute_name)
  }))

  return {
    props: {
      accroDeputes,
      pageBlank: true,
    },
  }
}

export { getServerSideProps, fetchQuery }