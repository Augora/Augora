import React, { Component } from "react";
import styled from "styled-components";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import GEOJsonCirco from './listCirco.json';

const Block = styled.div`
  display: flex;
  flex-direction: column;
  grid-column-end: span 1;
  background-color: rgba(0,0,0,0.15);
  border: solid 2px rgba(0,0,0,0.25);
  border-radius: 2px;
  padding: 10px;
`;
const MapBlock = styled.div`
  width: 100%;
  height: 100%;
`
const France = {
  center: {lng: 1.88, lat: 46.60},
  northWest: {lng: -6.864165, lat: 50.839888},
  southEast: {lng: 13.089067, lat: 41.284012}
}

// use it to resize the box as you wish, maybe with default values ?
interface CssValues {}
interface ICirco {
  nom: string,
  num: number
}
interface MyState {
  blockSize: string;
}

export default class MapCirco extends Component<ICirco> {
  mapRef: any;
  constructor(props: ICirco) {
    super(props)
  }
  componentDidMount() {
    mapboxgl.accessToken = 'pk.eyJ1Ijoia29iYXJ1IiwiYSI6ImNrMXBhdnV6YjBwcWkzbnJ5NDd5NXpja2sifQ.vvykENe0q1tLZ7G476OC2A';
    var map = new mapboxgl.Map({
      container: document.querySelector('.map'), // container id
      style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
      center: France.center, // starting position [lng, lat]
      zoom: 2, // starting zoom
    });

    // Récupérer la circonscription concernée
    const selectedCirco = GEOJsonCirco.features.find((circo) => {
      return circo.properties.nom_dpt.toLowerCase() === this.props.nom.toLowerCase() && parseInt(circo.properties.num_circ) === this.props.num
    })
    
    // Récupérer le NW et SE du(des) polygone(s) de la Circonscription
    let boxListOfLng = []
    let boxListOfLat = []
    if (selectedCirco.geometry.type === 'Polygon') {
      selectedCirco.geometry.coordinates[0].forEach(coords => {
        boxListOfLng.push(coords[0])
        boxListOfLat.push(coords[1])
      })
    } else {
      selectedCirco.geometry.coordinates.forEach(polygon => {
        polygon[0].forEach(coords => {
          boxListOfLng.push(coords[0])
          boxListOfLat.push(coords[1])
        })
      })
    }
    const selectedCircoBox = [
      [Math.min(...boxListOfLng), Math.max(...boxListOfLat)],
      [Math.max(...boxListOfLng), Math.min(...boxListOfLat)]
    ]

    // Dessiner la circo
    map.on('style.load', () => {
      if (selectedCirco) {
        map.addLayer({
          'id': this.props.nom.toLowerCase() + '-' + this.props.num,
          'type': 'fill',
          'source': {
            'type': 'geojson',
            'data': selectedCirco
          },
          'layout': {},
          'paint': {
            'fill-color': '#fff',
            'fill-opacity': 0.5,
            'fill-outline-color': '#f00'
          }
        })
        if (selectedCircoBox) {
          setTimeout(() => {
            map.fitBounds(selectedCircoBox,  {
              padding: 10
            })
          }, 1000)
        }
      }
    })
  }

  render = () => {
    return (
      <Block>
          <p>{this.props.nom}</p>
          <MapBlock ref={this.mapRef} className="map">
          </MapBlock>
      </Block>
    )
  }
}
