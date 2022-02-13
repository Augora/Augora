import React from "react"

export default function FAQLink({ children, link, colorHSL }) {
  return (
    <a href={`/faq#${link}`} style={{ color: colorHSL }}>
      {children}
    </a>
  )
}
