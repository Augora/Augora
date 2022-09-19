import React, { useEffect, useMemo, useState } from "react"
import HomeButton from "components/buttons/HomeButton"
import HomeGradientBar from "components/graphics/HomeGradientBar"
import SEO, { PageType } from "../components/seo/seo"
import Link from "next/link"
import { useRouter } from "next/router"
import { ViewState } from "react-map-gl"
import MapAugora from "components/maps/MapAugora"
// import {
//   MetroFeature,
//   getLayerPaint,
//   createFeatureCollection,
//   buildURLFromFeature,
//   getZoneName,
// } from "components/maps/maps-utils"
import { getDeputes, getGroupes } from "src/lib/deputes/Wrapper"
import GroupButton from "components/deputies-list/filters/GroupButton"
import shuffle from "lodash/shuffle"
import random from "lodash/random"
import useDeputiesFilters from "hooks/deputies-filters/useDeputiesFilters"
import IconPin from "images/ui-kit/icon-pin.svg"
import IconGroup from "images/ui-kit/icon-group.svg"
import IconFrance from "images/ui-kit/icon-france.svg"
import IconStat from "images/ui-kit/icon-stat.svg"
import IconInfo from "images/ui-kit/icon-info.svg"
import MetroCircFile from "static/circ-metro.geojson"
import OMCircFile from "static/circ-om.geojson"

// const dummyBlockNumber = 20
// const DummyBlock = () => {
//   return (
//     <div
//       className="deputes__dummy-block"
//       style={{
//         backgroundColor: `hsl(${random(170, 185)}, 90%, 40%)`,
//       }}
//     ></div>
//   )
// }

export default function IndexPage({ groupes }: { groupes: Group.GroupsList }) {
  const router = useRouter()

  const {
    state: { GroupeValue },
    handleGroupClick,
  } = useDeputiesFilters()
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

  // const [feature, setFeature] = useState<AugoraMap.Feature>(MetroFeature)
  // const allFeatures = useMemo(() => [MetroFeature, ...MetroCircFile.features, ...OMCircFile.features], [])

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     console.log("Changing feature...")
  //     setFeature(allFeatures[random(0, allFeatures.length - 1)])
  //   }, 10000)
  //   return () => clearInterval(interval)
  // }, [])

  return (
    <>
      <SEO pageType={PageType.Accueil} />
      <div className="page page__home page__landing">
        {/* <div className="grid">
          <button className="home__deputes home__block">
            <h2>Liste</h2>
            <div className="deputes__dummy-grid">
              <div className="deputes__dummy-grid-wrapper">
                {Array.apply(0, Array(dummyBlockNumber)).map((_, i) => {
                  return <DummyBlock key={`home-dummy-block-${i}`} />
                })}
              </div>
            </div>
          </button>
          <button className="home__map home__block">
            <h2>Carte</h2>
          </button>
          <button className="home__stats home__block">
            <h2>Statistiques</h2>
          </button>
        </div> */}
        <div className="home__intro panel panel--right">
          <div className="background">
            <img className="background__img" src="images/photos/hemicycle.jpg" />
          </div>
          <div className="panel__content">
            <h2 className="content__title content__title--center">Reconnecter les citoyens avec les députés</h2>
            <p>
              Nous sommes une association qui met en avant une utilisation éthique des données publiques. Nous proposons une
              présentation moderne des députés de l’assemblée nationale pour faciliter au maximum l’accès à ces informations.
            </p>
            <div className="content__buttons">
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
        </div>
        <div className="home__map panel panel--left panel--shared">
          <HomeGradientBar pos="left" />
          <div className="panel__content">
            <h2 className="content__title">Une carte interactive</h2>
            <p>
              Parcourez la terre avec une visualisation précise de chaque région, département, et territoire d’outre-mer.
              Découvrez où chaque circonscription se situe, et son député associé, y compris les députés hors de france, le monde
              entier est couvert. Les filtres permettent un affinage des données géographiques recherchées.
            </p>
            <div className="content__buttons">
              <HomeButton text="La Carte" icon={<IconFrance />} onClick="/carte" title="Aller sur la carte" />
            </div>
          </div>
          <div className="panel__map">
            {/* <MapAugora
              overlay={false}
              viewstate={viewstate}
              setViewstate={setViewstate}
              mapView={{
                geoJSON: createFeatureCollection([feature]),
                feature: feature,
                paint: getLayerPaint(),
              }}
            >
              <Link href={buildURLFromFeature(feature)}>
                <div className="map__redirect">
                  <span>{`${getZoneName(feature)}${feature.properties.nom_dpt ? ` de ${feature.properties.nom_dpt}` : ""}`}</span>
                </div>
              </Link>
            </MapAugora> */}
          </div>
        </div>
        <div className="home__stats panel panel--center">
          <div className="background">
            <div className="background__back" />
            <img className="background__img background__img--transparent" src="images/photos/bibliotheque.jpg" />
          </div>
          <div className="panel__content">
            <h2 className="content__title content__title--center">Des Statistiques</h2>
            <div className="content__buttons">
              <HomeButton
                text="Les Statistiques"
                icon={<IconStat />}
                inverted={true}
                onClick="/statistiques"
                title="Aller voir les statistiques"
              />
            </div>
          </div>
        </div>
        <div className="home__groups panel panel--right panel--shared">
          <HomeGradientBar pos="right" />
          <div className="panel__groups">
            {groupes.map((group) => (
              <GroupButton
                group={group}
                title={group.NomComplet}
                key={`groupe--${group.Sigle}`}
                onClick={() => {
                  groupes.forEach((grp) => {
                    if (grp.Sigle !== group.Sigle && GroupeValue[grp.Sigle]) handleGroupClick(grp.Sigle)
                    else if (grp.Sigle === group.Sigle && !GroupeValue[grp.Sigle]) handleGroupClick(grp.Sigle)
                  })
                  router.push("/deputes")
                }}
              />
            ))}
          </div>
          <div className="panel__content">
            <h2 className="content__title">Vos Députés</h2>
            <p>
              Classés par leur groupe parlementaire, à ne pas confondre avec leur parti politique. Pour plus d’informations,
              consultez la FAQ.
            </p>
            <div className="content__buttons">
              <HomeButton text="L'assemblée" icon={<IconGroup />} onClick="/deputes" title="Voir tous les députés" />
            </div>
          </div>
        </div>
        <div className="home__faq panel panel--center">
          <div className="background">
            <div className="background__back" />
            <img className="background__img background__img--transparent" src="images/photos/colonnade.jpg" />
          </div>
          <div className="panel__content">
            <h2 className="content__title content__title--center">En savoir plus</h2>
            <div>
              <p>
                Nous sommes une association à but non lucratif visant à proposer un site d’information publique au design moderne.
              </p>
              <p>
                Nous ne sommes pas associés à l’assemblée nationale ou aux députés, vous pourrez trouver des liens pour contacter
                ceux-ci sur leurs page personelles dédiées.{" "}
              </p>
              <p>Pour toute question concernant le site ou le fonctionnement de l’assemblée, consultez la FAQ.</p>
            </div>
            <div className="content__buttons">
              <HomeButton text="La FAQ" icon={<IconInfo />} inverted={true} onClick="/faq" title="Aller consulter la FAQ" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getStaticProps() {
  const [deputes, groupes] = await Promise.all([getDeputes(), getGroupes()])

  return {
    props: {
      deputes: shuffle(deputes),
      groupes: groupes,
      PageType: PageType.Accueil,
      transparentHeader: true,
    },
  }
}
