import React from "react"

interface IDeputiesWiki {
  content: string[]
}

export default function DeputiesWiki({ content }: IDeputiesWiki) {
  return (
    <>
      <div >{insertTextWithLineBreaks(content)}</div>
    </>
  )
}

function insertTextWithLineBreaks(content) {
  return (
    <span>
      {content.map((line, index) => (
        <React.Fragment key={index}>
          {line}<br />
          {index < content.length - 1 && <br />}
        </React.Fragment>
      ))}
    </span>
  );
}