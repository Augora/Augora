import React from "react"
import MapAugora from "components/maps/MapAugora"
import Block from "components/deputy/_block/_Block"
import Link from "next/link"

export default function MapDistrict(props: Bloc.Map) {
  const { NomCirconscription, NumeroCirconscription, NumeroDepartement } = props.deputy

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
          deputies={[props.deputy]}
          codeCirc={NumeroCirconscription}
          codeDpt={NumeroDepartement}
          overlay={false}
          forceCenter={true}
        />
        <Link href={`/carte?dpt=${NumeroDepartement}&circ=${NumeroCirconscription}`}>
          <div className="map__redirect"></div>
        </Link>
      </div>
    </Block>
  )
}
