import React from "react"
import { BaseControl, BaseControlProps } from "react-map-gl"

/**
 * Renvoie un CustomControl contenant un div contenant les children, avec toutes les props captures = true
 */
export default class CustomControl extends BaseControl<
  BaseControlProps,
  HTMLDivElement
> {
  static defaultProps = {
    captureScroll: true,
    captureDrag: true,
    captureClick: true,
    captureDoubleClick: true,
  }

  _render() {
    return (
      <div ref={this._containerRef} className="mapboxgl-ctrl-custom">
        {this.props.children}
      </div>
    )
  }
}
