import React from "react"

interface IDeputiesWiki {
  content: string
}

export default function DeputiesWiki({ content }: IDeputiesWiki) {
  return (
    <>
      <div>{content}</div>
    </>
  )
}
