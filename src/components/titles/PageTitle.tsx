import React from "react"
import GradientBanner from "../graphics/GradientBanner"

export default function PageTitle(props: { title: string }) {
  return (
    <>
      <div className="page-title">
        <h1 className="page-title__title">{props.title}</h1>
        <GradientBanner />
      </div>
    </>
  )
}
