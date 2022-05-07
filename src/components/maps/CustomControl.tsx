import React from "react"

interface ICustomControlProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  capture?: boolean
}

/**
 * Renvoie un CustomControl contenant un div contenant les children, avec toutes les props captures = true par défaut
 */
export default function CustomControl({ className, children, capture, ...props }: ICustomControlProps) {
  return (
    <div {...props} className={`mapboxgl-ctrl-custom ${className ? className : ""}`}>
      {children}
    </div>
  )
}
