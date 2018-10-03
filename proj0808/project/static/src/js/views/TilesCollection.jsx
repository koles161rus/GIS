import React from 'react';
import ol from 'openlayers';
import { bind } from 'app/utils';
import proj4 from 'proj4';
import $ from 'jquery';
import TilesCollectionItem from './TilesCollectionItem';
import AddTiles from './AddTiles';
import AddVector from './AddVector';
import { geojson } from './feature';

export default class TilesCollection extends React.Component {
  constructor(props) {
    super(props);

    bind( this, 
      'deleteLayer', 
      'addLayer', 
      'addVector', 
      'yandexProjection', 
      'standartProjection',
      'getQuad',
      'addQuad',
      'onSelectChange' );

    this.state = {
      tileList: undefined,
      vectorList: undefined,
      add: undefined
    };
  }
  deleteLayer(id, layer) {
    let layerIndex;
    if( layer instanceof ol.layer.Tile ) {
      layerIndex = this.state.tileList.findIndex( lay => lay.get('id') === id );
      this.state.tileList.splice(layerIndex, 1);
    } else {
      layerIndex = this.state.vectorList.findIndex( lay => lay.get('id') === id );
      this.state.vectorList.splice(layerIndex, 1);
    }
    this.forceUpdate();
  }
  addLayer(id, name, url) {
    this.state.tileList.push(new ol.layer.Tile({
      id: id,
      name: name,
      source: new ol.source.XYZ({
        url: url
      })
    }));
    this.forceUpdate();
  }
  addVector(id, name, red, green, blue, alpha, width, radius) {
    this.state.vectorList.push(new ol.layer.Vector({
      id: id,
      name: name,
      source: new ol.source.Vector(),
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba('+red+','+green+','+blue+','+alpha+')'
        }),
        stroke: new ol.style.Stroke({
          color: 'rgb('+red+','+green+','+blue+')',
          width: width
        }),
        image: new ol.style.Circle({
          radius: radius,
          fill: new ol.style.Fill({
            color: 'rgb('+red+','+green+','+blue+')'
          })
        })
      })
    }));
    this.forceUpdate();
  }
  yandexProjection(id) {
    let layerIndex = this.state.tileList.findIndex( lay => lay.get('id') === id );
    ol.proj.setProj4( proj4 );
    proj4.defs('EPSG:3395', '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs');
    let proj = ol.proj.get('EPSG:3395');
    proj.setExtent([
        -20037508.342789244,
        -20037508.342789244,
        20037508.342789244,
        20037508.342789244
    ]);
    let url = this.state.tileList[layerIndex].getSource().getUrls().join();
    let source = new ol.source.XYZ({
      url: url,
      projection: proj
    });
    this.state.tileList[layerIndex].setSource(source);
  }
  standartProjection(id) {
    let layerIndex = this.state.tileList.findIndex( lay => lay.get('id') === id );
    let url = this.state.tileList[layerIndex].getSource().getUrls().join();
    let source = new ol.source.XYZ({
      url: url,
      projection: 'EPSG:3857'
    });
    this.state.tileList[layerIndex].setSource(source);
  }
  componentDidMount() {
    $.ajax({ url: '/layers/' })
      .done( res => {
        const tileList = new Array();
        res.forEach( function(layer, i) {
          tileList[i] = new ol.layer.Tile({
            id: res[i].id,
            name: res[i].name,
            source: new ol.source.XYZ({
              url: res[i].url
            })
          });
        });
        this.setState({ tileList: tileList });
      } )
      .fail( request => {
        console.log("Слоёв нет");
      } );
    $.ajax({ url: '/layers/getvector' })
      .done( res => {
        const vectorList = new Array();
        res.forEach( function(layer, i) {
          vectorList[i] = new ol.layer.Vector({
            id: res[i].id,
            name: res[i].name,
            source: new ol.source.Vector(),
            style: new ol.style.Style({
              fill: new ol.style.Fill({
                color: 'rgba('+res[i].red+','+res[i].green+','+res[i].blue+','+res[i].alpha+')'
              }),
              stroke: new ol.style.Stroke({
                color: 'rgb('+res[i].red+','+res[i].green+','+res[i].blue+')',
                width: res[i].width
              }),
              image: new ol.style.Circle({
                radius: res[i].radius,
                fill: new ol.style.Fill({
                  color: 'rgb('+res[i].red+','+res[i].green+','+res[i].blue+')'
                })
              })
            })
          });
        });
        this.setState({ vectorList: vectorList });
      } )
      .fail( request => {
        console.log("Слоёв нет");
      } );
  }
  getQuad(x, y) {
    let z = this.props.map.getView().getZoom();
    let index = '';
    for (let i = 0; i < 2*z+2; i++) {
      let value = (function() {
        if (i % 2 === 0)
          return 0;
        let step = Math.pow(2, (i + 1) / 2);
        if (y % step >= step / 2)
          return 1;
        return 0;
      })();
      index = value + index;
    }
    let diff = parseInt(index, 2).toString(4);
    let xx = (x).toString(2);
 
    let ans = parseInt(xx, 10) + parseInt(diff, 10);
    ans = ans.toString();
    while (ans.length < z)
      ans = '0' + ans;
    return ans;
  }
  addQuad(id) {
    let layerIndex = this.state.tileList.findIndex( lay => lay.get('id') === id );
    let url = this.state.tileList[layerIndex].getSource().getUrls().join();
    let source = new ol.source.XYZ({
      tileUrlFunction: coord => {
        return url.replace('{x}', this.getQuad(coord[1], -coord[2]-1));
      }
    });
    this.state.tileList[layerIndex].setSource(source);
  }
  onSelectChange( event ) {
    let type = event.target.value;
    if( type === 'raster' ) {
      this.setState({ add: <AddTiles addLayer = {this.addLayer} /> });
    } else if( type === 'vector' ){
      this.setState({ add: <AddVector addVector = {this.addVector} /> });
    } else {
      this.setState({ add: undefined });
    }
  }
  render() {
    let {
      state: {
        tileList,
        vectorList,
        add
      }
    } = this;
    let map = this.props.map;
    let vector;
    let layer;
    if(map === undefined) {
      return null;
    } else {
      if(tileList === undefined) {
        return null;
      } else {
        layer = tileList.map( (lay, i) =>
          <TilesCollectionItem
            key = {i}
            deleteLayer = {this.deleteLayer}
            map = {map}
            layer = {lay}
            layersAdding = {this.layersAdding}
            yandexProjection = {this.yandexProjection}
            standartProjection = {this.standartProjection}
            addQuad = {this.addQuad}
          />
        );
      }
      if(vectorList === undefined) {
        return null;
      } else {
        vector = vectorList.map( (lay, i) =>
          <TilesCollectionItem
            key = {i}
            deleteLayer = {this.deleteLayer}
            map = {map}
            layer = {lay}
            layersAdding = {this.layersAdding}
          />
        );
      }
    }
    return <div>
      <form className="form-inline" style={{ 'display':'inline-block', 'margin':'0 0 5px 10px' }}>
        <label>Выберите тип слоя &nbsp;</label>
        <select id="type" className="geometry-menu" onChange={ this.onSelectChange }>
          <option value="select">Не выбран</option>
          <option value="raster">Растровый</option>
          <option value="vector">Векторный</option>
        </select>
      </form>
      {add}
      <details>
        <summary className='layers-list'>Загруженные растровые слои</summary>
        {layer}
      </details>
      <details>
        <summary className='layers-list'>Загруженные векторные слои</summary>
        {vector}
      </details>
    </div>;
  }
}