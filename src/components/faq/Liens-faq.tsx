import React from "react"
import Link from "next/link"

interface IFAQLink {
  children: React.ReactNode
  link: string
  colorHSL: string
}

export default function FAQLink({ children, link, colorHSL }: IFAQLink) {
  return (
    <Link href={`/faq#${link}`}>
      <a style={{ color: colorHSL }}>
        {children}
      </a>
    </Link>
  )
}
