import React, { useState } from "react"
import SEO, { PageType } from "../components/seo/seo"
import PageTitle from "../components/titles/PageTitle"
import Filters from "components/deputies-list/filters/Filters"
import PieChart from "components/charts/PieChart"
import BarChart from "components/charts/BarChart"
import BarStackChart from "components/charts/BarStackChart"
import Frame from "components/frames/Frame"
import { ParentSize } from "@visx/responsive"
import { getNbDeputiesGroup } from "components/deputies-list/deputies-list-utils"
import useDeputiesFilters from "hooks/deputies-filters/useDeputiesFilters"
import { getDeputes } from "src/lib/deputes/Wrapper"
import PyramideChart from "src/components/charts/PyramideChart"

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

// Non utilisé actuellement, permet de gérer des ranges d'âge pour la pyramide, ex : 27-32 si range définit à 5
const getRangeAgeData = (
  groupList: Group.GroupsList,
  list: Deputy.DeputiesList,
  ages: Filter.AgeDomain,
  range: number
): Chart.RangeAgeData[] => {
  const deltaAge = ages[1] - ages[0]
  return Array(deltaAge / range === 0 ? deltaAge / range : Math.round(deltaAge / range))
    .fill(null)
    .map((nothing, index) => {
      const age = `${ages[0] + range * index}-${
        ages[0] + range * (index + 1) > ages[1] ? ages[1] : ages[0] + range * (index + 1)
      }`
      const groups = groupList.reduce((acc, cur) => {
        const ageDeputies = list.filter(
          (depute) => depute.Age <= ages[0] + range * (index + 1) && depute.Age > ages[0] + range * index
        )
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

  const dataAgeFemme = getAgeData(
    state.GroupesList,
    state.FilteredList.filter((depute) => depute.Sexe === "F"),
    state.AgeDomain
  )
  const dataAgeHomme = getAgeData(
    state.GroupesList,
    state.FilteredList.filter((depute) => depute.Sexe === "H"),
    state.AgeDomain
  )

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
        <Frame className="frame-chart frame-barstack" title="Cumul des âges" right={`Âge moyen : ${averageAge} ans`}>
          <ParentSize className="barstack__container" debounceTime={10}>
            {(parent) => (
              <BarStackChart
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
      <section className="pyramide">
        <Frame className="frame-chart frame-pyramide" title="Pyramide des âges">
          <ParentSize className="pyramide__container" debounceTime={10}>
            {(parent) => (
              <PyramideChart
                width={parent.width}
                height={parent.height}
                groups={state.GroupesList}
                dataAgeFemme={dataAgeFemme}
                dataAgeHomme={dataAgeHomme}
                // dataAgeFemme={dataRangeAgeFemme}
                // dataAgeHomme={dataRangeAgeHomme}
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
