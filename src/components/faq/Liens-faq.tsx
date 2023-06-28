import React from "react"
import Link from "next/link"

interface IFAQLink {
  children: React.ReactNode
  link: string
  colorHSL: string
}

export default function FAQLink({ children, link, colorHSL }: IFAQLink) {
  return (
    <Link href={`/faq#${link}`} style={{ color: colorHSL }} scroll={false}>
      {children}
    </Link>
  )
}
