import React from "react"
import MapAugora from "components/maps/MapAugora"
import { createFeatureCollection, getFeatureURL, getLayerPaint } from "components/maps/maps-utils"
import Block from "components/deputy/_block/_Block"
import Link from "next/link"
import mapStore from "stores/mapStore"

export default function MapDistrict(props: Bloc.Map) {
  const { viewstate, setViewstate } = mapStore()

  return (
    <Block
      title="Circonscription"
      type="map"
      color={props.color}
      size={props.size}
      circ={{
        region: props.deputy.NomCirconscription,
        circNb: props.deputy.NumeroCirconscription,
      }}
    >
      <div className="map__container">
        <MapAugora
          deputies={[props.deputy]}
          overlay={false}
          viewstate={viewstate}
          setViewstate={setViewstate}
          mapView={{
            geoJSON: createFeatureCollection([props.deputeCirc]),
            feature: props.deputeCirc,
            paint: getLayerPaint(props.deputy.GroupeParlementaire.Couleur),
          }}
        />
        <Link href={`/carte/${getFeatureURL(props.deputeCirc)}`}>
          <div className="map__redirect"></div>
        </Link>
      </div>
    </Block>
  )
}
