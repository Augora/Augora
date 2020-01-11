import React from "react"
import { useStaticQuery, graphql } from "gatsby"

export default () => {
  const data = useStaticQuery(graphql`
    query GroupesParlementaire {
      faunadb {
        Deputes(_size: 700) {
          data {
            SigleGroupePolitique
          }
        }
      }
    }
  `)

  const allGroupesFromDeputes = data.faunadb.Deputes.data
  let allGroupes = []
  for (const depute of allGroupesFromDeputes) {
    allGroupes.push(depute.SigleGroupePolitique)
  }
  const allGroupesFiltered = [...new Set(allGroupes)]
  const allGroupesLines = allGroupesFiltered.map(groupe => {
    return <li className="groupe">{groupe}</li>
  })

  return <ul className="filters__groupe">{allGroupesLines}</ul>
}
