import React, { useState } from "react"
import SEO, { PageType } from "../components/seo/seo"
import PageTitle from "../components/titles/PageTitle"
import Filters from "components/deputies-list/filters/Filters"
import PieChart from "components/charts/PieChart"
import BarChart from "components/charts/BarChart"
import PyramideChart from "components/charts/PyramideChart"
import Frame from "components/frames/Frame"
import { ParentSize } from "@visx/responsive"
import { getNbDeputiesGroup } from "components/deputies-list/deputies-list-utils"
import useDeputiesFilters from "hooks/deputies-filters/useDeputiesFilters"
import { getDeputes } from "src/lib/deputes/Wrapper"

type Groups = {
  id: string
  label: string
  value: number
  color: string
}

const getAgeData = (groupList: Group.GroupsList, list: Deputy.DeputiesList, ages: Filter.AgeDomain): Chart.AgeData[] => {
  return Array(ages[1] - ages[0] + 1)
    .fill(null)
    .map((nothing, index) => {
      const age = ages[0] + index
      const groups = groupList.reduce((acc, cur) => {
        const ageDeputies = list.filter((depute) => depute.Age === age)
        return {
          ...acc,
          [cur.Sigle]: ageDeputies.filter((depute) => depute.GroupeParlementaire.Sigle === cur.Sigle),
        }
      }, {})

      return {
        age: age,
        groups: groups,
      }
    })
}

const Statistiques = (props) => {
  const { state } = useDeputiesFilters()

  const groupesData: Groups[] = state.GroupesList.map((groupe) => {
    const nbDeputeGroup = getNbDeputiesGroup(state.FilteredList, groupe.Sigle)
    return {
      id: groupe.Sigle,
      label: groupe.NomComplet,
      value: nbDeputeGroup,
      color: groupe.Couleur,
    }
  }).filter((groupe) => groupe.value !== 0)

  const dataAge = getAgeData(state.GroupesList, state.FilteredList, state.AgeDomain)

  const sumAge = dataAge.reduce((acc, cur) => {
    const curSum = Object.values(cur.groups).reduce((a, b) => a + b.length, 0)
    return acc + curSum * cur.age
  }, 0)

  const averageAge = sumAge > 0 ? Math.round(sumAge / state.FilteredList.length) : 0

  return (
    <>
      <section className="filters">
        <Filters />
        <Frame className="frame-chart" title="Demi donut">
          {state.FilteredList.length > 0 ? (
            <ParentSize debounceTime={10}>
              {(parent) => <PieChart width={parent.width} height={parent.height} data={groupesData} />}
            </ParentSize>
          ) : null}
        </Frame>
      </section>

      <section className="bars">
        <Frame className="frame-chart frame-bar" title="Diagramme en Barres">
          <ParentSize className="bar__container" debounceTime={10}>
            {(parent) => <BarChart width={parent.width} height={parent.height} data={groupesData} />}
          </ParentSize>
        </Frame>
        <Frame className="frame-chart frame-pyramide" title="Pyramide des âges" right={`Âge moyen : ${averageAge} ans`}>
          <ParentSize className="pyramide__container" debounceTime={10}>
            {(parent) => (
              <PyramideChart
                width={parent.width}
                height={parent.height}
                groups={state.GroupesList}
                dataAge={dataAge}
                totalDeputes={state.FilteredList.length}
              />
            )}
          </ParentSize>
        </Frame>
      </section>
    </>
  )
}

export default function StatsPage() {
  return (
    <>
      <SEO pageType={PageType.Statistiques} />
      <div className="page page__statistiques">
        <PageTitle title="Statistiques" />

        <Statistiques />
      </div>
    </>
  )
}

export async function getStaticProps() {
  const deputes = await getDeputes()

  return {
    props: {
      deputes,
    },
  }
}
