import React from "react"
import fs from "fs"
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

interface IDeputy {
  depute: Deputy.Deputy
  activites: { [Activites: string]: { [data: string]: Deputy.Activite[] } }[]
}

// const allColors = colors.map((color) => {
//   return "--" + color.name + "-color :" + color.hex + ";\n"
// })

export default function Deputy({ depute }: IDeputy) {
  const deputy = depute
  const color = deputy.GroupeParlementaire.CouleurDetail
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
          <Mandate {...getMandate(deputy)} color={color} size="small" />
          <Coworkers {...getCoworkers(deputy)} color={color} size="small" />
          <MapDistrict deputy={deputy} color={color} size="medium" />
          <Presence color={color} size="large" activite={deputy.Activite} wip={false} />
          <Contact color={color} size="medium" adresses={deputy.Adresses} />
          <GroupeEtParti {...getGroupesInformation(deputy)} color={color} size="medium" />
        </div>
      </div>
    </>
  )
}

export async function getStaticProps({ params: { slug } }: { params: { slug: string } }) {
  const depute: Deputy.Deputy = await getDepute(slug)

  return {
    props: {
      depute: depute,
      title: depute.Nom,
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
