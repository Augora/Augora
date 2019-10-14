import React, { Component } from "react";
import styled from "styled-components";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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
  circo: string;
}

export default class MapCirco extends Component<ICirco> {
  mapRef: any;
  constructor(props: ICirco) {
    super(props)

    console.log(props)
  }
  componentDidMount() {
    mapboxgl.accessToken = 'pk.eyJ1Ijoia29iYXJ1IiwiYSI6ImNrMXBhdnV6YjBwcWkzbnJ5NDd5NXpja2sifQ.vvykENe0q1tLZ7G476OC2A';
    var map = new mapboxgl.Map({
      container: document.querySelector('.map'), // container id
      style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
      center: France.center, // starting position [lng, lat]
      zoom: 2, // starting zoom
      fitBounds: [France.northWest, France.southEast]
    });

    setTimeout(() => {
      map.fitBounds([France.northWest, France.southEast])
    }, 1000)
  }

  render = () => {
    return (
      <Block>
          <p>{this.props.circo}</p>
          <MapBlock ref={this.mapRef} className="map">
          </MapBlock>
      </Block>
    )
  }
}
