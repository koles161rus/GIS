import React from 'react';
import ol from 'openlayers';
import GeoJSON from 'openlayers';
import Modify from 'openlayers';
import { safeCall } from 'app/utils';
import { geojson } from './feature';
import proj4 from 'proj4';
import $ from 'jquery';


export default class Map extends React.Component {
  shouldComponentUpdate() {
    return false;
  }
  componentDidMount() {
    let zoom = 14;
    let minZoom = 2;
    let maxZoom = 20;

    let projection1 = 'EPSG:4326';
    let projection2 = 'EPSG:3857';

    let center = [4330710, 5972970];

    let view1 = new ol.View({
          projection: projection1,
          center: ol.proj.transform(center, 'EPSG:3857', 'EPSG:4326'),
          zoom: zoom,
          minZoom: minZoom,
          maxZoom: maxZoom
        });

    let view2 = new ol.View({
          projection: projection2,
          center: center,
          zoom: zoom,
          minZoom: minZoom,
          maxZoom: maxZoom
        });

    let map = new ol.Map({
      target: 'ol-map',
      view: view2,
      controls: [
        new ol.control.MousePosition()
      ]
    });

    const vectorLayer = new ol.layer.Vector({
      name: 'Объекты',
      source: new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(geojson)
      }),
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(128, 0, 0, 0.2)'
        }),
        stroke: new ol.style.Stroke({
          color: '#800000',
          width: 2
        }),
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color: '#800000'
          })
        })
      })
    });

    vectorLayer.setZIndex(1);

    map.addLayer( vectorLayer );

    let _this = this;
    map.on('click', function(event) {

      let feature;
      map.forEachFeatureAtPixel(event.pixel, function(_feature, layer) {
        feature = _feature;
      });
      _this.props.setFeature(feature);

      //_this.rosreestrRequest(event);
    });

    this.props.setMap(map);

    window.mapDev = {
      map: map,
      ol: ol
    };
  }
  // rosreestrRequest(event) {
  //   let coordinates = event.coordinate;

  //   coordinates = ol.proj.transform( coordinates, 'EPSG:4326', 'EPSG:3857' );

  //   let x = coordinates[0];
  //   let y = coordinates[1];
  //   let url = 'http://pkk5.rosreestr.ru/api/features/1?sq={"type":"Point","coordinates":['+x+','+y+']}';
    
  //   $.ajax({
  //     url: url,
  //     method: 'GET',
  //     success: function( result ) {
  //       // alert( result );
  //       console.log( result );
  //     },
  //     error: function( request ) {
  //       // alert('error!');
  //     }
  //   });
  // }
  render() {
    return <div id='ol-map' className='map'></div>;
  }
}
