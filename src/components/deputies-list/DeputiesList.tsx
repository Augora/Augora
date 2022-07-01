import React, { useState } from "react"
import { getNbDeputiesGroup } from "./deputies-list-utils"
import useDeputiesFilters from "hooks/deputies-filters/useDeputiesFilters"
import Filters from "./filters/Filters"
import Deputy from "./deputy/Deputy"
import Frame from "components/frames/Frame"
import PieChart from "../charts/PieChart"
import BarChart from "../charts/BarChart"
import { ParentSize } from "@visx/responsive"
import { LazyLoadComponent } from "react-lazy-load-image-component"
import IconSwitch from "images/ui-kit/icon-chartswitch.svg"
import IconWikipedia from "images/ui-kit/icon-wikipedia.svg"
import IconAssemblee from "images/ui-kit/icon-palace.svg"
import DeputiesWiki from "./DeputiesWiki"

export default function DeputiesList() {
  const { state } = useDeputiesFilters()

  const [HasPieChart, setHasPieChart] = useState(true)

  const groupesData = state.GroupesList.map((groupe) => {
    const nbDeputeGroup = getNbDeputiesGroup(state.FilteredList, groupe.Sigle)
    return {
      id: groupe.Sigle,
      label: groupe.NomComplet,
      value: nbDeputeGroup,
      color: groupe.Couleur,
    }
  }).filter((groupe) => groupe.value !== 0)

  // Workaround until the value is in groupesData
  const groupeContent = `Le groupe La France insoumise (LFI) est un groupe parlementaire français de gauche radicale à l'Assemblée nationale.
  Présidé par Mathilde Panot, il est composé de dix-sept députés élus sous la bannière de La France insoumise lors des
  élections législatives de 2017. Certains d'entre eux sont également membres d'autres partis politiques, tels que le Parti
  de gauche, Ensemble !, la Gauche républicaine et socialiste, Picardie debout ou encore Rézistan's Égalité 974.`

  return (
    <>
      <section className="filters__section">
        <Filters />
        <Frame className="frame-chart frame-pie" title="Députés par groupes">
          {state.FilteredList.length > 0 ? (
            <>
              <button className="charts__switch" onClick={() => setHasPieChart(!HasPieChart)} title="Changer le graphique">
                <IconSwitch className="icon-switch" />
              </button>
              {HasPieChart ? (
                <ParentSize debounceTime={400}>
                  {(parent) => <PieChart width={parent.width} height={parent.height} data={groupesData} />}
                </ParentSize>
              ) : (
                <ParentSize className="bar__container" debounceTime={400}>
                  {(parent) => <BarChart width={parent.width} height={parent.height} data={groupesData} />}
                </ParentSize>
              )}
            </>
          ) : (
            <div className="no-deputy">Il n'y a pas de députés correspondant à votre recherche.</div>
          )}
        </Frame>
      </section>
      {groupesData.length === 1 ? (
        <>
          <section className="wikipedia__section">
            <Frame className="frame-wikipedia" title={`Groupe ${groupesData[0].label}`} style={{ color: groupesData[0].color }}>
              <a
                href={`https://fr.wikipedia.org/wiki/Groupe_La_France_insoumise`}
                target="_blank"
                rel="noreferrer"
                className="lien lien__wikipedia"
                title={`Page Wikipedia du groupe ${groupesData[0].label}`}
              >
                <IconWikipedia className="icon-wikipedia" style={{ fill: groupesData[0].color }} />
              </a>
              <a
                href={`https://www2.assemblee-nationale.fr/15/les-groupes-politiques/groupe-la-france-insoumise/(block)/42317`}
                target="_blank"
                rel="noreferrer"
                className="lien lien__assemblee"
                title={`Page de l'Assemblée Nationale du groupe ${groupesData[0].label}`}
              >
                <IconAssemblee className="icon-assemblee" style={{ fill: groupesData[0].color }} />
              </a>
              <DeputiesWiki content={groupeContent} />
            </Frame>
          </section>
        </>
      ) : (
        ""
      )}

      <section className="deputies__list">
        {state.FilteredList.length > 0 ? (
          state.FilteredList.map((depute) => {
            return (
              <LazyLoadComponent key={depute.Slug}>
                <Deputy depute={depute} />
              </LazyLoadComponent>
            )
          })
        ) : (
          <div className="deputies__no-result">Aucun résultat ne correspond à votre recherche</div>
        )}
      </section>
    </>
  )
}
