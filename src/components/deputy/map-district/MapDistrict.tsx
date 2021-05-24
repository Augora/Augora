import React from "react"
import MapAugora from "components/maps/MapAugora"
import { buildURLFromFeature, createFeatureCollection, getFeature } from "components/maps/maps-utils"
import Block from "components/deputy/_block/_Block"
import Link from "next/link"
import mapStore from "stores/mapStore"

export default function MapDistrict(props: Bloc.Map) {
  const { NomCirconscription, NumeroCirconscription, NumeroDepartement } = props.deputy
  const mapCodes = {
    code_circ: NumeroCirconscription,
    code_dpt: NumeroDepartement,
  }
  const feature = getFeature(mapCodes)
  const { paint, viewport, setViewport } = mapStore()

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
        <MapAugora
          allDeputies={[props.deputy]}
          overlay={false}
          forceCenter={true}
          viewport={viewport}
          setViewport={setViewport}
          mapView={{ geoJSON: createFeatureCollection([feature]), feature: feature, paint: paint }}
        />
        <Link href={buildURLFromFeature(feature)}>
          <div className="map__redirect"></div>
        </Link>
      </div>
    </Block>
  )
}
