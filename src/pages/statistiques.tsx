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
import PyramideBarStackChart from "src/components/charts/PyramideBar/PyramideBarStack"
import { getAgeData, rangifyAgeData } from "components/charts/chart-utils"
import IconSwitch from "images/ui-kit/icon-chartswitch.svg"

type Groups = {
  id: string
  label: string
  value: number
  color: string
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

  const dataAge = getAgeData(state.GroupesList, state.FilteredList, state.AgeDomain)
  const isRange = dataAge.length < 30
  const dataAgeFemme = isRange
    ? getAgeData(state.GroupesList, state.FilteredList, state.AgeDomain, "F")
    : rangifyAgeData(getAgeData(state.GroupesList, state.FilteredList, state.AgeDomain, "F"), 6)
  const dataAgeHomme = isRange
    ? getAgeData(state.GroupesList, state.FilteredList, state.AgeDomain, "H")
    : rangifyAgeData(getAgeData(state.GroupesList, state.FilteredList, state.AgeDomain, "H"), 6)

  const sumAge = dataAge.reduce((acc, cur) => {
    const curSum = Object.values(cur.groups).reduce((a, b) => a + b.length, 0)
    return acc + curSum * (cur.age as number)
  }, 0)

  const averageAge = sumAge > 0 ? Math.round(sumAge / state.FilteredList.length) : 0

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
                dataAge={dataAge}
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
          <ParentSize className="pyramide__container" debounceTime={10}>
            {(parent) =>
              HasPyramideBarStack ? (
                <PyramideBar
                  width={parent.width}
                  height={parent.height}
                  dataAgeHomme={dataAgeHomme}
                  dataAgeFemme={dataAgeFemme}
                  totalDeputes={state.FilteredList.length}
                />
              ) : (
                <PyramideBarStackChart
                  width={parent.width}
                  height={parent.height}
                  groups={state.GroupesList}
                  dataAgeFemme={dataAgeFemme}
                  dataAgeHomme={dataAgeHomme}
                  totalDeputes={state.FilteredList.length}
                />
              )
            }
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
