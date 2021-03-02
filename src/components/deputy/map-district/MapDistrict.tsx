import React, { useState, useMemo } from "react"
import ReactMapGL, { Source, Layer, ViewportProps } from "react-map-gl"
import Link from "next/link"
import { France, flyToBounds, AllCirc } from "components/maps/maps-utils"
import Block from "components/deputy/_block/_Block"
import "mapbox-gl/dist/mapbox-gl.css"

export default function MapDistrict(props: Bloc.Map) {
  const { NomCirconscription, NumeroCirconscription, NumeroDepartement } = props.deputy
  const [viewport, setViewport] = useState<ViewportProps>({
    latitude: France.center.lat,
    longitude: France.center.lng,
    zoom: 3,
  })

  //récupère le polygone de la circonscription
  const districtPolygon = useMemo(() => {
    return AllCirc.features.find((district) => {
      return district.properties.code_dpt === NumeroDepartement && district.properties.code_circ === NumeroCirconscription
    })
  }, [NumeroCirconscription, NumeroDepartement])

  return (
    <Block
      title="Circonscription"
      type="map"
      color={props.color}
      size={props.size}
      circ={{
        region: NomCirconscription,
        circNb: NumeroCirconscription,
      }}
    >
      <div className="map__container">
        <ReactMapGL
          mapboxApiAccessToken="pk.eyJ1IjoiYXVnb3JhIiwiYSI6ImNraDNoMXVwdjA2aDgyeG55MjN0cWhvdWkifQ.pNUguYV6VedR4PY0urld8w"
          mapStyle="mapbox://styles/augora/ckh3h62oh2nma19qt1fgb0kq7?optimize=true"
          {...viewport}
          width="100%"
          height="100%"
          minZoom={2}
          dragRotate={false}
          doubleClickZoom={false}
          touchRotate={false}
          dragPan={false}
          touchZoom={false}
          scrollZoom={false}
          onResize={() => {
            flyToBounds(districtPolygon, viewport, setViewport)
          }}
          onViewportChange={setViewport}
        >
          <Source type="geojson" data={districtPolygon}>
            <Layer
              type="fill"
              paint={{
                "fill-color": "#fff",
                "fill-opacity": 0.5,
              }}
            />
            <Layer
              type="line"
              paint={{
                "line-color": props.color,
                "line-width": 2,
                // "line-dasharray": [4, 2],
              }}
            />
          </Source>
          <Link href={`/map?codeDpt=${districtPolygon?.properties?.code_dpt}`}>
            <a className="map__redirect">Cliquer pour voir la carte entière</a>
          </Link>
        </ReactMapGL>
      </div>
    </Block>
  )
}
