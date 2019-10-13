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

// use it to resize the box as you wish, maybe with default values ?
interface CssValues {}

export default class MapCirco extends Component {
  componentDidMount() {
    mapboxgl.accessToken = 'pk.eyJ1Ijoia29iYXJ1IiwiYSI6ImNrMXBhdnV6YjBwcWkzbnJ5NDd5NXpja2sifQ.vvykENe0q1tLZ7G476OC2A';
    var map = new mapboxgl.Map({
      container: document.querySelector('.map'), // container id
      style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
      center: [-74.50, 40], // starting position [lng, lat]
      zoom: 9 // starting zoom
    });
  }

  render = () => {
    return (
      <Block>
          <MapBlock ref={this.mapRef} className="map">
          </MapBlock>
      </Block>
    )
  }
}
