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
import PyramideBar from "src/components/charts/PyramideBar/PyramideBar"
import PyramideBarRange from "src/components/charts/PyramideBar/PyramideBarRange"
import PyramideBarStackChart from "src/components/charts/PyramideBarStackChart"
import PyramideRangeBarStackChart from "src/components/charts/PyramideRangeBarStackChart"
import IconSwitch from "images/ui-kit/icon-chartswitch.svg"

type Groups = {
  id: string
  label: string
  value: number
  color: string
}

const getStackAgeData = (
  groupList: Group.GroupsList,
  list: Deputy.DeputiesList,
  ages: Filter.AgeDomain
): Chart.StackAgeData[] => {
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

const getAgeData = (groupList: Group.GroupsList, list: Deputy.DeputiesList, ages: Filter.AgeDomain): Chart.AgeData[] => {
  return Array(ages[1] - ages[0] + 1)
    .fill(null)
    .map((nothing, index) => {
      const age = ages[0] + index
      const deputyCount = list.filter((depute) => depute.Age === age).length
      return {
        age: age,
        deputyCount: deputyCount,
      }
    })
}

const getRangeAgeData = (
  groupList: Group.GroupsList,
  list: Deputy.DeputiesList,
  ages: Filter.AgeDomain,
  range: number
): Chart.RangeAgeData[] => {
  const deltaAge = ages[1] - ages[0]
  return Array(deltaAge / range === 0 ? deltaAge / range : Math.ceil(deltaAge / range))
    .fill(null)
    .map((nothing, index) => {
      const ageBorneMin = ages[0] + range * index
      const ageBorneMax = ages[0] + range * (index + 1) > ages[1] ? ages[1] : ages[0] + range * (index + 1)
      const age = `${ageBorneMin}-${ageBorneMax}`
      const deputyCount = list.filter((depute) => depute.Age <= ageBorneMax && depute.Age >= ageBorneMin).length

      return {
        age: age,
        deputyCount: deputyCount,
      }
    })
}

const getRangeStackAgeData = (
  groupList: Group.GroupsList,
  list: Deputy.DeputiesList,
  ages: Filter.AgeDomain,
  range: number
): Chart.RangeStackAgeData[] => {
  const deltaAge = ages[1] - ages[0]
  return Array(deltaAge / range === 0 ? deltaAge / range : Math.ceil(deltaAge / range))
    .fill(null)
    .map((nothing, index) => {
      const ageBorneMin = ages[0] + range * index
      const ageBorneMax = ages[0] + range * (index + 1) > ages[1] ? ages[1] : ages[0] + range * (index + 1)
      const age = `${ageBorneMin}-${ageBorneMax}`
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
  const [HasPyramideBarStack, setHasPyramideBarStack] = useState(true)

  const groupesData: Groups[] = state.GroupesList.map((groupe) => {
    const nbDeputeGroup = getNbDeputiesGroup(state.FilteredList, groupe.Sigle)
    return {
      id: groupe.Sigle,
      label: groupe.NomComplet,
      value: nbDeputeGroup,
      color: groupe.Couleur,
    }
  }).filter((groupe) => groupe.value !== 0)

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

  const dataRangeAgeFemme = getRangeAgeData(
    state.GroupesList,
    state.FilteredList.filter((depute) => depute.Sexe === "F"),
    state.AgeDomain,
    5
  )

  const dataRangeAgeHomme = getRangeAgeData(
    state.GroupesList,
    state.FilteredList.filter((depute) => depute.Sexe === "H"),
    state.AgeDomain,
    5
  )

  const dataStackAge = getStackAgeData(state.GroupesList, state.FilteredList, state.AgeDomain)

  const dataStackAgeFemme = getStackAgeData(
    state.GroupesList,
    state.FilteredList.filter((depute) => depute.Sexe === "F"),
    state.AgeDomain
  )
  const dataStackAgeHomme = getStackAgeData(
    state.GroupesList,
    state.FilteredList.filter((depute) => depute.Sexe === "H"),
    state.AgeDomain
  )

  const range = 5
  const dataStackRangeAgeFemme = getRangeStackAgeData(
    state.GroupesList,
    state.FilteredList.filter((depute) => depute.Sexe === "F"),
    state.AgeDomain,
    range
  )

  const dataStackRangeAgeHomme = getRangeStackAgeData(
    state.GroupesList,
    state.FilteredList.filter((depute) => depute.Sexe === "H"),
    state.AgeDomain,
    range
  )

  const sumAge = dataStackAge.reduce((acc, cur) => {
    const curSum = Object.values(cur.groups).reduce((a, b) => a + b.length, 0)
    return acc + curSum * cur.age
  }, 0)

  const averageAge = sumAge > 0 ? Math.round(sumAge / state.FilteredList.length) : 0

  const currentRange = dataAgeFemme[dataAgeFemme.length - 1].age - dataAgeFemme[0].age

  return (
    <>
      <section className="filters">
        <Filters />
        <Frame className="frame-chart" title="Hémicycle">
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
                dataAge={dataStackAge}
                totalDeputes={state.FilteredList.length}
              />
            )}
          </ParentSize>
        </Frame>
      </section>
      <section className="pyramide">
        <Frame className="frame-chart frame-pyramide" title="Pyramide des âges">
          <button
            className="charts__switch"
            onClick={() => setHasPyramideBarStack(!HasPyramideBarStack)}
            title="Changer le graphique"
          >
            <IconSwitch className="icon-switch" />
          </button>
          {HasPyramideBarStack ? (
            currentRange > 20 ? (
              <ParentSize className="pyramide__container" debounceTime={10}>
                {(parent) => (
                  <PyramideBarRange
                    width={parent.width}
                    height={parent.height}
                    dataAgeFemme={dataRangeAgeFemme}
                    dataAgeHomme={dataRangeAgeHomme}
                    totalDeputes={state.FilteredList.length}
                  />
                )}
              </ParentSize>
            ) : (
              <ParentSize className="pyramide__container" debounceTime={10}>
                {(parent) => (
                  <PyramideBar
                    width={parent.width}
                    height={parent.height}
                    dataAgeFemme={dataAgeFemme}
                    dataAgeHomme={dataAgeHomme}
                    totalDeputes={state.FilteredList.length}
                  />
                )}
              </ParentSize>
            )
          ) : currentRange > 20 ? (
            <ParentSize className="pyramide__container" debounceTime={10}>
              {(parent) => (
                <PyramideRangeBarStackChart
                  width={parent.width}
                  height={parent.height}
                  groups={state.GroupesList}
                  dataAgeFemme={dataStackRangeAgeFemme}
                  dataAgeHomme={dataStackRangeAgeHomme}
                  totalDeputes={state.FilteredList.length}
                />
              )}
            </ParentSize>
          ) : (
            <ParentSize className="pyramide__container" debounceTime={10}>
              {(parent) => (
                <PyramideBarStackChart
                  width={parent.width}
                  height={parent.height}
                  groups={state.GroupesList}
                  dataAgeFemme={dataStackAgeFemme}
                  dataAgeHomme={dataStackAgeHomme}
                  totalDeputes={state.FilteredList.length}
                />
              )}
            </ParentSize>
          )}
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
