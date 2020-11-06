import React from "react"
import { BaseControl, BaseControlProps } from "react-map-gl"

interface ICustomControlProps extends BaseControlProps {
  className?: string
  style?: React.CSSProperties
}

/**
 * Renvoie un CustomControl contenant un div contenant les children, avec toutes les props captures = true
 *
 * Utilisé pour afficher un bouton sur la map qui ne trigger pas la navigation de la map en dessous
 */
export default class CustomControl extends BaseControl<ICustomControlProps, HTMLDivElement> {
  static defaultProps = {
    captureScroll: true,
    captureDrag: true,
    captureClick: true,
    captureDoubleClick: true,
  }

  _render() {
    return (
      <div ref={this._containerRef} className={`mapboxgl-ctrl-custom ${this.props.className ? this.props.className : ""}`}>
        {this.props.children}
      </div>
    )
  }
}
