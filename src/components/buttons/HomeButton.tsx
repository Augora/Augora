import React from "react"
import Link from "next/link"

interface IHomeButton {
  text: string
  icon?: React.ReactNode
  title?: string
  inverted?: boolean
  onClick?: string | (<T>(args?: T) => void)
}

/**
 * Return a button for home page
 * @param text Le texte à l'intérieur
 * @param icon Une icone (svg ou img) à afficher à la gauche
 * @param inverted Savoir si les couleurs doivent etre inversées ou pas, par défaut fond blanc
 * @param onClick La fonction appelée au click, ou un href
 */
export default function HomeButton({ text, icon, onClick, title, inverted = false }: IHomeButton) {
  return typeof onClick === "string" ? (
    <Link href={onClick} className={`home-btn${inverted ? " inverted" : ""}`} title={title ? title : ""}>
      <div className="home-btn__icon icon-wrapper">{icon}</div>
      <span className="home-btn__text">{text}</span>
    </Link>
  ) : (
    <button className={`home-btn${inverted ? " inverted" : ""}`} onClick={onClick} title={title ? title : ""}>
      <div className="home-btn__icon icon-wrapper">{icon}</div>
      <span className="home-btn__text">{text}</span>
    </button>
  )
}
