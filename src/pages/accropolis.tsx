import React from "react"
import { fetchQuery } from 'utils/utils';
import { getDeputes } from "../lib/deputes/Wrapper"

export default function Accropolis(props) {
  return (
    <></>
  )
}

async function getServerSideProps(context) {
  // const res = await fetch(`http://localhost:1337/deputes`)
  const listed_deputes = await fetchQuery('deputes')
  // const depute: { Depute: Deputy.Deputy } = await getDepute('roland-lescure')
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

const baseUrl = 'http://localhost:1337';

export { getServerSideProps, baseUrl, fetchQuery }