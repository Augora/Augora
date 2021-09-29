import React from "react"
import { fetchQuery } from 'utils/utils';
import { getDeputeAccropolis } from "../lib/deputes/Wrapper"
// import axios from 'axios'

export default function Accropolis() {
  return (
    <></>
  )
}

async function getServerSideProps() {
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