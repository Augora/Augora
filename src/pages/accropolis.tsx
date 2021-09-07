import React from "react"

export default function Accropolis() {
  return (
    <></>
  )
}

export async function getStaticProps() {
  return {
    props: {
      pageBlank: true,
    },
  }
}
