import React from "react"
import fs from "fs"
import Head from "next/head"
import { getDepute, getDeputesSlugs } from "../../lib/deputes/Wrapper"
import Socials from "components/deputy/socials/Socials"
import Coworkers from "components/deputy/coworkers/Coworkers"
import MapDistrict from "components/deputy/map-district/MapDistrict"
import { getGeneralInformation } from "utils/augora-objects/deputy/information"
import { getMandate } from "utils/augora-objects/deputy/mandate"
import { getCoworkers } from "utils/augora-objects/deputy/coworker"
import GeneralInformation from "components/deputy/general-information/GeneralInformation"
import Mandate from "components/deputy/mandate/Mandate"
import Contact from "components/deputy/contact/Contact"
import Presence from "components/deputy/presence/Presence"
import Feed from "src/components/deputy/feed-twitter/FeedTwitter"
import SEO, { PageType } from "components/seo/seo"
interface IDeputy {
  depute: Deputy.Deputy
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
          <Presence color={color} size="large" wip={true} />
          <Contact color={color} size="medium" adresses={deputy.AdressesDetails.data} />
          {deputy.Twitter.length != 0 ? <Feed color={color} size="medium" twitter={deputy.Twitter} /> : ""}
        </div>
      </div>
    </>
  )
}

export async function getStaticProps({ params: { slug } }) {
  const depute = await getDepute(slug)

  return {
    props: {
      depute,
      title: depute.Nom,
    },
  }
}

export async function getStaticPaths() {
  if (!fs.existsSync(".cache/")) {
    fs.mkdirSync(".cache")
  }
  var paths = null
  if (process.env.USE_CACHE) {
    if (fs.existsSync(".cache/DeputesSlugs.json")) {
      paths = JSON.parse(fs.readFileSync(".cache/DeputesSlugs.json").toString())
    }
  }

  if (!paths) {
    const deputes = await getDeputesSlugs()
    paths = deputes.data.DeputesEnMandat.data.map((d) => ({
      params: {
        slug: d.Slug,
      },
    }))
    if (process.env.USE_CACHE) {
      fs.writeFileSync(".cache/DeputesSlugs.json", JSON.stringify(paths))
    }
  }

  return {
    paths,
    fallback: false,
  }
}
