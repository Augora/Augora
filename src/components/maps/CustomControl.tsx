import React from "react"
import { BaseControl, BaseControlProps } from "react-map-gl"

export interface CustomControlProps extends BaseControlProps {
  children?: React.ReactNode
  onClick: Function
  className?: string
  title?: string
}

/**
 * Crée un bouton custom de type BaseControl (pour mapbox)
 * @param {Function} onClick La function appelée au click
 * @param {React.ReactNode} [children] Il est nécéssaire de lui passer une image en child pour avoir une icone
 * @param {string} [className] Une class HTML optionelle
 * @param {string} [title] Le texte au hover optionel
 */
export default class CustomControl extends BaseControl<
  CustomControlProps,
  HTMLButtonElement
> {
  public static defaultProps = {
    className: "",
    title: "Réinitialiser",
  }

  _render() {
    return (
      <button
        ref={this._containerRef}
        className={this.props.className}
        onClick={() => this.props.onClick()}
        title={this.props.title}
      >
        <div className="icon-wrapper">{this.props.children}</div>
      </button>
    )
  }
}
