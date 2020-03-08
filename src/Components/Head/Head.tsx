import React, { useState, useEffect } from "react"

interface HeadProps {
  titleContent: string
  titleLogoSrc: string
}

/* USELESS */
function Head(props: HeadProps) {
  return (
    <head>
      <title> {props.titleContent} </title>
      <base href="../../Assets/Logos" />
      <link rel="icon" type="image/png" href={props.titleLogoSrc} />
    </head>
  )
}

export default Head
