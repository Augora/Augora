import React, { useState } from "react"
import SEO, { PageType } from "../components/seo/seo"
import Filters from "components/deputies-list/filters/Filters"
import PieChart from "components/charts/PieChart"
import BarChart from "components/charts/BarChart"
import XYBarStack from "src/components/charts/XYBarStack"
import Frame from "components/frames/Frame"
import { ParentSize } from "@visx/responsive"
import useDeputiesFilters from "hooks/deputies-filters/useDeputiesFilters"
import { getDeputes, getGroupes } from "../lib/deputes/Wrapper"
import PyramideBar from "src/components/charts/PyramideBar/PyramideBar"
import PyramideBarStack from "src/components/charts/PyramideBar/PyramideBarStack"
import { getAgeData } from "components/charts/chart-utils"
import IconSwitch from "images/ui-kit/icon-chartswitch.svg"
import shuffle from "lodash/shuffle"
import ChartLegend from "src/components/charts/ChartLegend"
import { useRouter } from "next/router"

// import WordCloud from "src/components/charts/WordCloud"
// import { Lyrics } from "../static/lyrics"

const Statistiques = () => {
  const { state, isolateGroup, isolateSex, handleAgeSlider } = useDeputiesFilters()
  const router = useRouter()

  const [HasPyramideBarStack, setHasPyramideBarStack] = useState(true)

  const dataAge = getAgeData(state.GroupesList, state.FilteredList, state.AgeDomain)
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
            {(parent) => (
              <PieChart
                width={parent.width}
                height={parent.height}
                deputesData={{ groupList: state.GroupesList, deputes: state.FilteredList }}
                onClick={(sigle) => {
                  isolateGroup(sigle)
                  router.push("/")
                }}
              />
            )}
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
              <>
                <div className="barstackchart chart">
                  <XYBarStack
                    width={parent.width}
                    height={parent.height}
                    deputesData={{ groupList: state.GroupesList, deputes: state.FilteredList, ageDomain: state.AgeDomain }}
                  />
                </div>
                <ChartLegend groupList={state.GroupesList} />
              </>
            )}
          </ParentSize>
        ) : (
          <div className="no-deputy">Il n'y a pas de députés correspondant à votre recherche.</div>
        )}
      </Frame>
      <Frame className="frame-chart frame-bar" title="Députés par groupe">
        {state.FilteredList.length > 0 ? (
          <ParentSize className="bar__container" debounceTime={400}>
            {(parent) => (
              <BarChart
                width={parent.width}
                height={parent.height}
                deputesData={{ groupList: state.GroupesList, deputes: state.FilteredList }}
                onClick={(sigle) => {
                  isolateGroup(sigle)
                  router.push("/")
                }}
              />
            )}
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
            <div className="frame__axes">
              <div>Hommes</div>
              <div>Femmes</div>
            </div>
            <ParentSize className="pyramide__container" debounceTime={400}>
              {(parent) =>
                HasPyramideBarStack ? (
                  <PyramideBar
                    width={parent.width}
                    height={parent.height}
                    deputesData={{ groupList: state.GroupesList, deputes: state.FilteredList, ageDomain: state.AgeDomain }}
                    onClick={(age: Filter.AgeDomain, sex: Filter.Gender) => {
                      handleAgeSlider(age)
                      isolateSex(sex)
                      router.push("/")
                    }}
                  />
                ) : (
                  <PyramideBarStack
                    width={parent.width}
                    height={parent.height}
                    deputesData={{ groupList: state.GroupesList, deputes: state.FilteredList, ageDomain: state.AgeDomain }}
                  />
                )
              }
            </ParentSize>
          </>
        ) : (
          <div className="no-deputy">Il n'y a pas de députés correspondant à votre recherche.</div>
        )}
      </Frame>
      {/* <Frame className="frame-chart frame-nuage" title="Champ lexical des députés">
        {state.FilteredList.length > 0 ? (
          <ParentSize className="nuage__container" debounceTime={400}>
            {(parent) => <WordCloud width={parent.width} height={parent.height} data={Lyrics} />}
          </ParentSize>
        ) : (
          <div className="no-deputy">Il n'y a pas de données correspondant à votre recherche.</div>
        )}
      </Frame> */}
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
  const [deputes, groupes] = await Promise.all([getDeputes(), getGroupes()])

  return {
    props: {
      deputes: shuffle(deputes),
      groupes,
      title: "Statistiques",
      PageType: PageType.Statistiques,
    },
  }
}
