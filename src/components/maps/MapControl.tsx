import React, { cloneElement } from "react"
import { createPortal } from "react-dom"
import { ControlPosition, IControl, MapboxMap, useControl } from "react-map-gl"

interface IMapControl {
  position: ControlPosition
  className?: string
  children?: React.ReactElement
}

class OverlayControl implements IControl {
  _map: MapboxMap = null
  _container: HTMLElement
  _className: string

  constructor(className: string) {
    this._className = className
  }

  onAdd(map) {
    this._map = map
    /* global document */
    this._container = document.createElement("div")
    this._container.className = this._className
    return this._container
  }

  onRemove() {
    this._container.remove()
    this._map = null
  }

  getMap() {
    return this._map
  }

  getElement() {
    return this._container
  }
}

/**
 * Encapsule un mapcontrol custom dans un hook react map gl, pas obligatoire mais plus clean
 * @param {ControlPosition} position Position dans la map (top left, top right, bottom left, bottom right)
 */
export default function MapControl({ position, className, children }: IMapControl) {
  const ctrl = useControl<OverlayControl>(() => new OverlayControl(`mapboxgl-ctrl ${className ? className : ""}`), {
    position: position,
  })

  const map = ctrl.getMap()

  return map && createPortal(cloneElement(children, { map }), ctrl.getElement())
}
