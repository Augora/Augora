import React, { useState } from "react"
import SEO, { PageType } from "../components/seo/seo"
import Filters from "components/deputies-list/filters/Filters"
import PieChart from "components/charts/PieChart"
import BarChart from "components/charts/BarChart"
import XYBarStack from "src/components/charts/XYBarStack"
import Frame from "components/frames/Frame"
import { ParentSize } from "@visx/responsive"
import { getNbDeputiesGroup } from "components/deputies-list/deputies-list-utils"
import useDeputiesFilters from "hooks/deputies-filters/useDeputiesFilters"
import { getDeputes } from "src/lib/deputes/Wrapper"
import PyramideBar from "src/components/charts/PyramideBar/PyramideBar"
import PyramideBarStack from "src/components/charts/PyramideBar/PyramideBarStack"
import { getAgeData, rangifyAgeData } from "components/charts/chart-utils"
import IconSwitch from "images/ui-kit/icon-chartswitch.svg"

type Groups = {
  id: string
  label: string
  value: number
  color: string
}

const Statistiques = () => {
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
  const dataAgeRange = rangifyAgeData(getAgeData(state.GroupesList, state.FilteredList, state.AgeDomain), 6)
  const isRange = dataAge.length < 30
  const dataAgeFemme = isRange
    ? getAgeData(state.GroupesList, state.FilteredList, state.AgeDomain, "F")
    : rangifyAgeData(getAgeData(state.GroupesList, state.FilteredList, state.AgeDomain, "F"), 6)
  const dataAgeHomme = isRange
    ? getAgeData(state.GroupesList, state.FilteredList, state.AgeDomain, "H")
    : rangifyAgeData(getAgeData(state.GroupesList, state.FilteredList, state.AgeDomain, "H"), 6)

  const maxAgeFemme = Math.max(...dataAgeFemme.map((d) => d.total))
  const maxAgeHomme = Math.max(...dataAgeHomme.map((d) => d.total))
  const maxAge = Math.max(maxAgeFemme, maxAgeHomme)

  const sumAge = dataAge.reduce((acc, cur) => {
    const curSum = Object.values(cur.groups).reduce((a, b) => a + b.length, 0)
    return acc + curSum * (cur.age as number)
  }, 0)

  const averageAge = sumAge > 0 ? Math.round(sumAge / state.FilteredList.length) : 0

  return (
    <div className="statistiques__grid">
      <div className="filters">
        <Filters />
      </div>
      <Frame className="frame-chart frame-pie" title="Hémicycle">
        {state.FilteredList.length > 0 ? (
          <ParentSize debounceTime={400}>
            {(parent) => <PieChart width={parent.width} height={parent.height} data={groupesData} />}
          </ParentSize>
        ) : (
          <div className="no-deputy">Il n'y a pas de députés correspondant à votre recherche.</div>
        )}
      </Frame>
      <Frame
        className="frame-chart frame-barstack"
        title="Cumul des âges"
        right={averageAge != 0 ? `Âge moyen : ${averageAge} ans` : ""}
      >
        {state.FilteredList.length > 0 ? (
          <ParentSize className="barstack__container" debounceTime={400}>
            {(parent) => (
              <div className="barstackchart chart">
                <XYBarStack
                  width={parent.width}
                  height={parent.height}
                  groups={state.GroupesList}
                  dataAge={dataAge}
                  dataAgeRange={dataAgeRange}
                  totalDeputes={state.FilteredList.length}
                  axisLeft={true}
                  renderVertically={true}
                  marginTop={30}
                  marginLeft={20}
                />
              </div>
            )}
          </ParentSize>
        ) : (
          <div className="no-deputy">Il n'y a pas de députés correspondant à votre recherche.</div>
        )}
      </Frame>
      <Frame className="frame-chart frame-bar" title="Députés par groupe">
        {state.FilteredList.length > 0 ? (
          <ParentSize className="bar__container" debounceTime={400}>
            {(parent) => <BarChart width={parent.width} height={parent.height} data={groupesData} />}
          </ParentSize>
        ) : (
          <div className="no-deputy">Il n'y a pas de députés correspondant à votre recherche.</div>
        )}
      </Frame>
      <Frame className="frame-chart frame-pyramide" title="Pyramide des âges">
        {state.FilteredList.length > 0 ? (
          <>
            <button
              className="charts__switch"
              onClick={() => setHasPyramideBarStack(!HasPyramideBarStack)}
              title="Changer le graphique"
            >
              <IconSwitch className="icon-switch" />
            </button>
            <ParentSize className="pyramide__container" debounceTime={400}>
              {(parent) =>
                HasPyramideBarStack ? (
                  <PyramideBar
                    width={parent.width}
                    height={parent.height}
                    dataAgeHomme={dataAgeHomme}
                    dataAgeFemme={dataAgeFemme}
                    totalDeputes={state.FilteredList.length}
                    maxAge={maxAge}
                  />
                ) : (
                  <PyramideBarStack
                    width={parent.width}
                    height={parent.height}
                    groups={state.GroupesList}
                    dataAgeFemme={dataAgeFemme}
                    dataAgeHomme={dataAgeHomme}
                    totalDeputes={state.FilteredList.length}
                    maxAge={maxAge}
                  />
                )
              }
            </ParentSize>
          </>
        ) : (
          <div className="no-deputy">Il n'y a pas de députés correspondant à votre recherche.</div>
        )}
      </Frame>
    </div>
  )
}

export default function StatsPage() {
  return (
    <>
      <SEO pageType={PageType.Statistiques} />
      <div className="page page__statistiques">
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
      title: "Statistiques",
      PageType: PageType.Statistiques,
    },
  }
}
