import React from "react"

interface IFAQLink {
  children: React.ReactNode
  link: string
  colorHSL: string
}

export default function FAQLink({ children, link, colorHSL }: IFAQLink) {
  return (
    <a href={`/faq#${link}`} style={{ color: colorHSL }}>
      {children}
    </a>
  )
}
