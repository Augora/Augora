import React, { useEffect, useMemo, useState } from "react"
import HomeButton from "components/buttons/HomeButton"
import HomeGradientBar from "components/graphics/HomeGradientBar"
import SEO, { PageType } from "../components/seo/seo"
import Link from "next/link"
import { useRouter } from "next/router"
import { ViewState } from "react-map-gl"
import MapAugora from "components/maps/MapAugora"
import { createFeatureCollection, getFeatureURL, getZoneName } from "components/maps/maps-utils"
import { getDeputes, getGroupes } from "src/lib/deputes/Wrapper"
import GroupButton from "components/deputies-list/filters/GroupButton"
import BarChart from "components/charts/BarChart"
import shuffle from "lodash/shuffle"
import random from "lodash/random"
import { ParentSize } from "@visx/responsive"
import useDeputiesFilters from "hooks/deputies-filters/useDeputiesFilters"
import IconPin from "images/ui-kit/icon-pin.svg"
import IconGroup from "images/ui-kit/icon-group.svg"
import IconFrance from "images/ui-kit/icon-france.svg"
import IconStat from "images/ui-kit/icon-stat.svg"
import IconInfo from "images/ui-kit/icon-info.svg"
import IconChevron from "images/ui-kit/icon-chevron.svg"
import MetroFeature from "static/cont-france.geojson"
import MetroCircFile from "static/circ-metro.geojson"
import OMCircFile from "static/circ-om.geojson"
import XYBarStack from "src/components/charts/XYBarStack"
import ChartLegend from "src/components/charts/ChartLegend"
import PyramideBar from "src/components/charts/PyramideBar/PyramideBar"
import PyramideBarStack from "src/components/charts/PyramideBar/PyramideBarStack"
import Panel from "src/components/home/Panel"
import Parallax from "src/components/home/Parallax"
import MouseScroll from "src/components/home/MouseScroll"
import bibliotheque from "images/photos/bibliotheque.jpg"
import hemicycle from "images/photos/hemicycle.jpg"
import colonnade from "images/photos/colonnade.jpg"

// Home Page
export default function IndexPage({ groupes, features }: { groupes: Group.GroupsList; features: AugoraMap.Feature[] }) {
  const router = useRouter()

  const { state, isolateGroup, handleAgeSlider, isolateSex } = useDeputiesFilters()
  const [viewstate, setViewstate] = useState<ViewState>({
    zoom: 2,
    longitude: 2.23,
    latitude: 46.44,
    bearing: 0,
    pitch: 0,
    padding: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  })

  const [IndexFeature, setIndexFeature] = useState(0)
  const [IndexGraphes, setIndexGraphes] = useState(0)

  // Home map auto-play random circo
  useEffect(() => {
    const timeout = setTimeout(() => {
      cycleFeatures()
    }, 10000)
    return () => clearTimeout(timeout)
  }, [IndexFeature])

  // Number of graphs for the carousel
  const maxGraphes = useMemo(() => 4, [])

  // Switch zone function for map
  const cycleFeatures = (back?: boolean) => {
    if (back) {
      IndexFeature <= 0 ? setIndexFeature(features.length - 1) : setIndexFeature(IndexFeature - 1)
    } else {
      IndexFeature >= features.length - 1 ? setIndexFeature(0) : setIndexFeature(IndexFeature + 1)
    }
  }

  // Render
  return (
    <>
      <SEO pageType={PageType.Accueil} />
      <div className="page page__home page__landing">
        <Panel className="home__intro" orientation="right">
          <Parallax img={hemicycle} intro />
          <div className="panel__content">
            <h2 className="content__title content__title--center">Reconnecter les citoyens avec leurs représentants</h2>
            <p className="content__text">
              Nous sommes une association qui met en avant une utilisation éthique des données publiques. Nous proposons une
              présentation moderne des députés de l’assemblée nationale pour faciliter au maximum l’accès à ces informations.
            </p>
            <div className="content__buttons">
              <HomeButton
                text="Mon Député"
                icon={<IconPin />}
                inverted={true}
                onClick="/carte?geolocate=true"
                title="Découvrir mon député"
              />
              <HomeButton
                text="L'assemblée"
                icon={<IconGroup />}
                inverted={true}
                onClick="/deputes"
                title="Voir tous les députés"
              />
            </div>
          </div>
          <MouseScroll />
        </Panel>
        <Panel className="home__map" orientation="left" shared>
          <HomeGradientBar pos="left" />
          <div className="panel__content">
            <h2 className="content__title">Une carte interactive</h2>
            <p className="content__text">
              Parcourez la terre avec une visualisation précise de chaque région, département et territoire d'outre-mer. Découvrez
              l'emplacement de chaque circonscription et son député associé, y compris les députés hors de France. Le monde entier
              est couvert. Les filtres permettent de préciser les données géographiques recherchées.
            </p>
            <div className="content__buttons">
              <HomeButton text="La Carte" icon={<IconFrance />} onClick="/carte" title="Aller sur la carte" />
            </div>
          </div>
          <div className="panel__map">
            <button
              className="map__arrow map__arrow--left"
              title="Circonscription précédente"
              onClick={() => cycleFeatures(true)}
            >
              <IconChevron />
            </button>
            <div className="map__container">
              <MapAugora
                overlay={false}
                viewstate={viewstate}
                setViewstate={setViewstate}
                mapView={{
                  geoJSON: createFeatureCollection([features[IndexFeature]]),
                  feature: features[IndexFeature],
                }}
                marker={
                  <span>{`${getZoneName(features[IndexFeature])}${features[IndexFeature].properties.nom_dpt ? ` de ${features[IndexFeature].properties.nom_dpt}` : ""
                    }`}</span>
                }
              >
                <Link href={`carte/${getFeatureURL(features[IndexFeature])}`}>
                  <div className="map__redirect"></div>
                </Link>
              </MapAugora>
            </div>
            <button className="map__arrow map__arrow--right" title="Circonscription suivante" onClick={() => cycleFeatures()}>
              <IconChevron />
            </button>
          </div>
          <div className="content__buttons--responsive">
            <HomeButton text="La Carte" icon={<IconFrance />} onClick="/carte" title="Aller sur la carte" />
          </div>
        </Panel>
        <Panel className="home__stats" orientation="center">
          <Parallax img={bibliotheque} gradient />
          <div className="panel__content panel__content--center">
            <h2 className="content__title content__title--center">Des statistiques</h2>
            <p>
              Nous essayons de rendre plus accessible l'immense quantité de données publique à travers des représentations
              graphiques simples et intéractives. De nouveaux graphiques sont ajoutés au fil du temps pour mieux rendre compte de
              l'activité et des contextes sociaux de l'Assemblée nationale.
            </p>
            <div className="content__carousel">
              <div className="carousel__arrow carousel__arrow--left">
                <button
                  title="Graphe précédent"
                  onClick={() => (IndexGraphes !== 0 ? setIndexGraphes(IndexGraphes - 1) : setIndexGraphes(maxGraphes - 1))}
                >
                  <IconChevron />
                </button>
              </div>
              <div className="carousel__content">
                <span className="carousel__subtitle carousel__subtitle--center">
                  {IndexGraphes === 0
                    ? "Députés par groupes parlementaires"
                    : IndexGraphes == 1
                      ? "Cumul des âges des députés"
                      : IndexGraphes == 2
                        ? "Pyramide des âges par sexe"
                        : "Pyramide des âges par groupe parlementaire"}
                </span>
                {IndexGraphes == 0 && (
                  <ParentSize debounceTime={400}>
                    {(parent) => (
                      <BarChart
                        width={parent.width}
                        height={parent.height}
                        deputesData={{ groupList: state.GroupesList, deputes: state.DeputiesList }}
                        onClick={(sigle) => {
                          isolateGroup(sigle)
                          router.push("/deputes")
                        }}
                      />
                    )}
                  </ParentSize>
                )}
                {IndexGraphes == 1 && (
                  <ParentSize debounceTime={400}>
                    {(parent) => (
                      <>
                        <div className="barstackchart chart">
                          <XYBarStack
                            width={parent.width}
                            height={parent.height}
                            deputesData={{
                              groupList: state.GroupesList,
                              deputes: state.DeputiesList,
                              ageDomain: state.InitialAgeDomain,
                            }}
                            animation={true}
                          />
                        </div>
                        <ChartLegend groupList={state.GroupesList} />
                      </>
                    )}
                  </ParentSize>
                )}
                {IndexGraphes == 2 && (
                  <>
                    <div className="sexe">
                      <div>Hommes</div>
                      <div>Femmes</div>
                    </div>
                    <ParentSize debounceTime={400}>
                      {(parent) => (
                        <PyramideBar
                          width={parent.width}
                          height={parent.height}
                          deputesData={{
                            groupList: state.GroupesList,
                            deputes: state.DeputiesList,
                            ageDomain: state.InitialAgeDomain,
                          }}
                          onClick={(age: Filter.AgeDomain, sex: Filter.Gender) => {
                            handleAgeSlider(age)
                            isolateSex(sex)
                            router.push("/deputes")
                          }}
                        />
                      )}
                    </ParentSize>
                  </>
                )}
                {IndexGraphes == 3 && (
                  <>
                    <div className="sexe">
                      <div>Hommes</div>
                      <div>Femmes</div>
                    </div>
                    <ParentSize debounceTime={400}>
                      {(parent) => (
                        <PyramideBarStack
                          width={parent.width}
                          height={parent.height}
                          deputesData={{
                            groupList: state.GroupesList,
                            deputes: state.DeputiesList,
                            ageDomain: state.InitialAgeDomain,
                          }}
                          legendClass="pyramide"
                          animation={true}
                        />
                      )}
                    </ParentSize>
                  </>
                )}
              </div>
              <div className="carousel__arrow carousel__arrow--right">
                <button
                  title="Graphe suivant"
                  onClick={() => (IndexGraphes === maxGraphes - 1 ? setIndexGraphes(0) : setIndexGraphes(IndexGraphes + 1))}
                >
                  <IconChevron />
                </button>
              </div>
            </div>
            <div className="content__buttons">
              <HomeButton
                text="Tous nos graphiques"
                icon={<IconStat />}
                inverted={true}
                onClick="/statistiques"
                title="Consulter l'ensemble des visualisation statistiques"
              />
            </div>
          </div>
        </Panel>
        <Panel className="home__groups" orientation="right" shared>
          <HomeGradientBar pos="right" />
          <div className="panel__groups">
            {groupes.map((group) => (
              <GroupButton
                group={group}
                title={group.NomComplet}
                key={`groupe--${group.Sigle}`}
                onClick={() => {
                  isolateGroup(group.Sigle)
                  router.push("/deputes")
                }}
              />
            ))}
          </div>
          <div className="panel__content">
            <h2 className="content__title">Vos Députés</h2>
            <p className="content__text">
              Les députés sont organisés en groupe parlementaire.
              <br />
              <strong>Différents des partis politiques</strong>, ces groupes ont un fonctionnement propre à l'Assemblée nationale.
            </p>
            <div className="content__buttons">
              <HomeButton
                text="En savoir plus"
                icon={<IconInfo />}
                onClick="/faq#quest-ce-quun-groupe-parlementaire"
                title="Plus d'informations sur les groupes parlementaires"
              />
            </div>
          </div>
          <div className="content__buttons--responsive">
            <HomeButton
              text="En savoir plus"
              icon={<IconInfo />}
              onClick="/faq#quest-ce-quun-groupe-parlementaire"
              title="Plus d'informations sur les groupes parlementaires"
            />
          </div>
        </Panel>
        <Panel className="home__faq" orientation="center">
          <Parallax img={colonnade} gradient />
          <div className="panel__content">
            <div className="panel__wrapper">
              <h2 className="content__title content__title--center">À propos de nous</h2>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <p className="content__text">
                  Nous sommes une association à but non lucratif visant à proposer un site d’information publique utilisant les
                  données ouvertes, des outils et des concepts graphiques modernes.
                </p>
                <p className="content__text">
                  Nous ne sommes pas associés à l’assemblée nationale ou aux députés, vous pourrez trouver des liens pour
                  contacter ceux-ci sur leurs page personelles dédiées.
                </p>
                <hr style={{ border: "none", backgroundColor: "white", height: "2px", width: "50%" }} />
                <p className="content__text">
                  Pour toute question concernant le site ou le fonctionnement de l’assemblée, vous pouvez consultez notre FAQ.
                </p>
              </div>
              <div className="content__buttons">
                <HomeButton text="Notre FAQ" icon={<IconInfo />} inverted={true} onClick="/faq" title="Aller consulter la FAQ" />
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </>
  )
}

export async function getStaticProps() {
  const [deputes, groupes] = await Promise.all([getDeputes(), getGroupes()])
  const allFeatures = [...MetroFeature.features, ...MetroCircFile.features, ...OMCircFile.features]
  const rdmFeatures = Array.from({ length: 10 }, () => allFeatures[random(0, allFeatures.length - 1)])

  return {
    props: {
      deputes: shuffle(deputes),
      groupes: groupes,
      PageType: PageType.Accueil,
      features: rdmFeatures,
      transparentHeader: true,
    },
  }
}
