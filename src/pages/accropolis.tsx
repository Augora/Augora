import React from "react"
import { fetchQuery } from 'utils/utils';
import { getDeputes } from "../lib/deputes/Wrapper"

export default function Accropolis(props) {
  return (
    <></>
  )
}

async function getServerSideProps(context) {
  const listed_deputes = await fetchQuery('deputes')
  const deputes = await getDeputes()

  return {
    props: {
      // depute : depute.Depute,
      // res: res,
      listed_deputes,
      deputes,
      pageBlank: true,
    },
  }
}

export { getServerSideProps, fetchQuery }