import React from "react"
import HomeButton from "components/buttons/HomeButton"
import SEO, { PageType } from "../components/seo/seo"
import { useRouter } from "next/router"
import IconPin from "images/ui-kit/icon-pin.svg"
import IconGroup from "images/ui-kit/icon-group.svg"
import IconFrance from "images/ui-kit/icon-france.svg"
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
        <div className="home__intro panel">
          <div className="intro__background">
            <img className="background__img" src="images/photos/hemicycle.jpg" />
          </div>
          <div className="panel__content panel__content--right">
            <h2>Reconnecter les citoyens avec les députés</h2>
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
        <div className="home__map panel">
          <div className="panel__content panel__content--left">
            <h2>Une carte interactive</h2>
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
