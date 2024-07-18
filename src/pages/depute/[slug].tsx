import React from "react"
import Head from "next/head"
import { getDepute, getDeputesSlugs } from "../../lib/deputes/Wrapper"
import Socials from "components/deputy/socials/Socials"
import Coworkers from "components/deputy/coworkers/Coworkers"
import MapDistrict from "components/deputy/map-district/MapDistrict"
import { getGeneralInformation, getGroupesInformation } from "utils/augora-objects/deputy/information"
import { getMandate } from "utils/augora-objects/deputy/mandate"
import { getCoworkers } from "utils/augora-objects/deputy/coworker"
import GeneralInformation from "components/deputy/general-information/GeneralInformation"
import Mandate from "components/deputy/mandate/Mandate"
import Contact from "components/deputy/contact/Contact"
import Presence from "components/deputy/presence/Presence"
import SEO, { PageType } from "components/seo/seo"
import GroupeEtParti from "src/components/deputy/groupes/groupe-parti"
import Missions from "src/components/deputy/missions-parlementaires/missions"
import { getOrganismes } from "src/utils/augora-objects/deputy/organismes"
import { getFeature } from "components/maps/maps-imports"

interface IDeputy {
  depute: Deputy.Deputy
  deputeCirc: AugoraMap.Feature
  activites: { [Activites: string]: { [data: string]: Deputy.Activite[] } }[]
}

export default function Deputy({ depute, deputeCirc }: IDeputy) {
  const deputy = depute
  const color = deputy.GroupeParlementaire.CouleurDetail
  const organismes = getOrganismes(deputy)
  return (
    <>
      <SEO pageType={PageType.Depute} depute={deputy} />
      <Head>
        <style>{`:root { --groupe-color: ${color.HSL.Full}; }`}</style>
      </Head>
      <Socials deputy={deputy} />
      <div className="page page__deputy">
        <div className="deputy__content">
          <GeneralInformation {...getGeneralInformation(deputy)} color={color} size="medium" dateBegin={deputy.DateDeNaissance} />
          <GroupeEtParti {...getGroupesInformation(deputy)} sexe={deputy.Sexe} color={color} size="medium" />
          <MapDistrict deputy={deputy} deputeCirc={deputeCirc} color={color} size="medium" />
          <Coworkers {...getCoworkers(deputy)} color={color} size="medium" />
          <Mandate {...getMandate(deputy)} color={color} size="medium" />
          <Contact color={color} size="medium" adresses={deputy.Adresses} />
          <Presence color={color} size="large" activite={deputy.Activite} wip={false} />
          <Missions {...organismes} color={color} size="medium" wip={false} />
        </div>
      </div>
    </>
  )
}

export async function getStaticProps({ params: { slug } }: { params: { slug: string } }) {
  const depute: Deputy.Deputy = await getDepute(slug)
  const feature = getFeature({
    code_circ: depute.NumeroCirconscription,
    code_dpt: depute.NumeroDepartement,
  })

  return {
    props: {
      depute: depute,
      deputeCirc: feature,
      title: `${depute.Prenom} ${depute.Nom}`,
    },
  }
}

export async function getStaticPaths() {
  const deputesSlugs = await getDeputesSlugs()

  return {
    paths: deputesSlugs.map((d) => ({
      params: {
        slug: d.Slug,
      },
    })),
    fallback: false,
  }
}
