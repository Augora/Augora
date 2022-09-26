import React, { useEffect, useMemo, useState } from "react"
import HomeButton from "components/buttons/HomeButton"
import HomeGradientBar from "components/graphics/HomeGradientBar"
import SEO, { PageType } from "../components/seo/seo"
import Link from "next/link"
import { useRouter } from "next/router"
import { ViewState } from "react-map-gl"
import MapAugora from "components/maps/MapAugora"
import { getLayerPaint, createFeatureCollection, getFeatureURL, getZoneName, createFeature } from "components/maps/maps-utils"
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

  const [feature, setFeature] = useState<AugoraMap.Feature>(features[random(0, features.length - 1)])
  const [IndexGraphes, setIndexGraphes] = useState(0)
  const maxGraphes = 4

  // Home map auto-play random circo
  useEffect(() => {
    const interval = setInterval(() => {
      setFeature(features[random(0, features.length - 1)])
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  // Home intro parallax
  useEffect(() => {}, [])

  // Render
  return (
    <>
      <SEO pageType={PageType.Accueil} />
      <div className="page page__home page__landing">
        <Panel className="home__intro" orientation="right">
          <Parallax img="images/photos/hemicycle.jpg" intro />
          <div className="panel__content">
            <h2 className="content__title content__title--center">Reconnecter les citoyens avec ses représentants</h2>
            <p className="content__text">
              Nous sommes une association qui met en avant une utilisation éthique des données publiques. Nous proposons une
              présentation moderne des députés de l’assemblée nationale pour faciliter au maximum l’accès à ces informations.
            </p>
            <div className="content__buttons content__buttons--right">
              <HomeButton text="Mon Député" icon={<IconPin />} inverted={true} onClick="/carte" title="Découvrir mon député" />
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
              Parcourez la terre avec une visualisation précise de chaque région, département, et territoire d’outre-mer.
              Découvrez où chaque circonscription se situe, et son député associé, y compris les députés hors de france, le monde
              entier est couvert. Les filtres permettent un affinage des données géographiques recherchées.
            </p>
            <div className="content__buttons content__buttons--left">
              <HomeButton text="La Carte" icon={<IconFrance />} onClick="/carte" title="Aller sur la carte" />
            </div>
          </div>
          <div className="panel__map">
            <button
              className="map__arrow map__arrow--left"
              title="Circonscription précédente"
              // onClick={() => (IndexGraphes !== 0 ? setIndexGraphes(IndexGraphes - 1) : setIndexGraphes(maxGraphes - 1))}
            >
              <IconChevron />
            </button>
            <div className="map__container">
              <MapAugora
                overlay={false}
                viewstate={viewstate}
                setViewstate={setViewstate}
                mapView={{
                  geoJSON: createFeatureCollection([feature]),
                  feature: feature,
                  paint: getLayerPaint(),
                }}
              >
                <Link href={`carte/${getFeatureURL(feature)}`}>
                  <div className="map__redirect">
                    <span>{`${getZoneName(feature)}${
                      feature.properties.nom_dpt ? ` de ${feature.properties.nom_dpt}` : ""
                    }`}</span>
                  </div>
                </Link>
              </MapAugora>
            </div>
            <button
              className="map__arrow map__arrow--right"
              title="Circonscription suivante"
              // onClick={() => (IndexGraphes !== 0 ? setIndexGraphes(IndexGraphes - 1) : setIndexGraphes(maxGraphes - 1))}
            >
              <IconChevron />
            </button>
          </div>
        </Panel>
        <Panel className="home__stats" orientation="center">
          <Parallax img="images/photos/bibliotheque.jpg" gradient />
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
                text="Tout nos graphiques"
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
            <div className="content__buttons content__buttons--right">
              <HomeButton
                text="En savoir plus"
                icon={<IconInfo />}
                onClick="/faq#quest-ce-quun-groupe-parlementaire"
                title="Plus d'informations sur les groupes parlementaires"
              />
            </div>
          </div>
        </Panel>
        <Panel className="home__faq" orientation="center">
          <Parallax img="images/photos/colonnade.jpg" gradient />
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
