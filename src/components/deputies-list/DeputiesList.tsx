import React, { useState } from "react"
import { getNbDeputiesGroup } from "./deputies-list-utils"
import useDeputiesFilters from "hooks/deputies-filters/useDeputiesFilters"
import Filters from "./filters/Filters"
import Deputy from "./deputy/Deputy"
import Frame from "components/frames/Frame"
import PieChart from "../charts/PieChart"
import BarChart from "../charts/BarChart"
import { LazyLoadComponent } from "react-lazy-load-image-component"
import IconSwitch from "images/ui-kit/icon-chartswitch.svg"

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

  return (
    <>
      <section className="filters">
        <Filters />
        <Frame className="frame-chart" title="Répartition">
          {state.FilteredList.length > 0 ? (
            <div className="filters__charts">
              <button className="charts__switch" onClick={() => setHasPieChart(!HasPieChart)} title="Changer le graphique">
                <IconSwitch className="icon-switch" />
              </button>
              {HasPieChart ? (
                <PieChart width={420} height={230} data={groupesData} />
              ) : (
                <BarChart width={480} height={280} data={groupesData} />
              )}
            </div>
          ) : null}
        </Frame>
      </section>

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
