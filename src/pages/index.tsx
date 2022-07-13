import React from "react"
import random from "lodash/random"

import SEO, { PageType } from "../components/seo/seo"

const dummyBlockNumber = 20
const DummyBlock = () => {
  return (
    <div
      className="deputes__dummy-block"
      style={{
        backgroundColor: `hsl(${random(170, 185)}, 90%, 40%)`,
      }}
    ></div>
  )
}

export default function IndexPage() {
  return (
    <>
      <SEO pageType={PageType.Accueil} />
      <div className="page page__home page__landing">
        <div className="grid">
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
