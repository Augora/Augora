import React from "react"
import HomeButton from "components/buttons/HomeButton"
import HomeGradientBar from "components/graphics/HomeGradientBar"
import SEO, { PageType } from "../components/seo/seo"
import { useRouter } from "next/router"
import IconPin from "images/ui-kit/icon-pin.svg"
import IconGroup from "images/ui-kit/icon-group.svg"
import IconFrance from "images/ui-kit/icon-france.svg"
import IconStat from "images/ui-kit/icon-stat.svg"
import IconInfo from "images/ui-kit/icon-info.svg"
// import random from "lodash/random"

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

export default function IndexPage() {
  const router = useRouter()

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
              <HomeButton
                text="Mon Député"
                icon={<IconPin />}
                inverted={true}
                onClick={() => router.push("/carte")}
                title="Découvrir mon député"
              />
              <HomeButton
                text="L'assemblée"
                icon={<IconGroup />}
                inverted={true}
                onClick={() => router.push("/deputes")}
                title="Voir tous les députés"
              />
            </div>
          </div>
        </div>
        <div className="home__map panel panel--left">
          <HomeGradientBar pos="left" />
          <div className="panel__content">
            <h2 className="content__title">Une carte interactive</h2>
            <p>
              Parcourez la terre avec une visualisation précise de chaque région, département, et territoire d’outre-mer.
              Découvrez où chaque circonscription se situe, et son député associé, y compris les députés hors de france, le monde
              entier est couvert. Les filtres permettent un affinage des données géographiques recherchées.
            </p>
            <div className="content__buttons">
              <HomeButton
                text="La Carte"
                icon={<IconFrance />}
                onClick={() => router.push("/carte")}
                title="Aller sur la carte"
              />
            </div>
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
                onClick={() => router.push("/statistiques")}
                title="Aller voir les statistiques"
              />
            </div>
          </div>
        </div>
        <div className="home__groups panel panel--right">
          <HomeGradientBar pos="right" />
          <div className="panel__content">
            <h2 className="content__title">Vos Députés</h2>
            <p>
              Classés par leur groupe parlementaire, à ne pas confondre avec leur parti politique. Pour plus d’informations,
              consultez la FAQ.
            </p>
            <div className="content__buttons">
              <HomeButton
                text="L'assemblée"
                icon={<IconGroup />}
                onClick={() => router.push("/deputes")}
                title="Voir tous les députés"
              />
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
              <HomeButton
                text="La FAQ"
                icon={<IconInfo />}
                inverted={true}
                onClick={() => router.push("/faq")}
                title="Aller consulter la FAQ"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      title: "Augora",
      PageType: PageType.Accueil,
    },
  }
}
