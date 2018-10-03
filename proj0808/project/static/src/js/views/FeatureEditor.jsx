import React from 'react';
import ol from 'openlayers';
import { bind } from 'app/utils';
import { geojson } from './feature';
import $ from 'jquery';

export default class FeatureEditor extends React.Component {
  constructor ( props ) {
    super( props );

    bind( this,  
      'onRemoveFeature', 
      'onDeleteFeature', 
      'onAddFeature', 
      'onSaveFeatures', 
      'onGetFeatures' );

    this.state = {
      NameInputValue: undefined,
      DescriptInputValue: undefined,
      id: undefined
    };
  }

  onRemoveFeature() {
    let vectorSource = this.props.vector.getSource();
    let layerList = this.props.map.getLayers().getArray();
    let indexOfVectorLayer = layerList.findIndex( item => item.get('name') === 'Объекты' );
    let vectorLayerSource = layerList[indexOfVectorLayer].getSource();
    let selectedFeatures = this.props.selectInteraction.getFeatures();
    selectedFeatures.forEach( function(selectedFeature) {
      selectedFeatures.remove(selectedFeature);
      let vectorFeatures = vectorSource.getFeatures();
      vectorFeatures.forEach( function(sourceFeature) {
        if (sourceFeature === selectedFeature) {
          vectorSource.removeFeature(sourceFeature);
        }
      });
      let vectorLayerFeatures = vectorLayerSource.getFeatures();
      vectorLayerFeatures.forEach( function(sourceLayerFeature) {
        if (sourceLayerFeature === selectedFeature) {
          vectorLayerSource.removeFeature(sourceLayerFeature);
        }
      });
    });
  }

  onAddFeature() {
    let features = this.props.vector.getSource().getFeatures();
    let dataFeatures = new ol.format.GeoJSON().writeFeatures(features);
    let parseFeatures = JSON.parse(dataFeatures);
    let selectedFeatures = this.props.selectInteraction.getFeatures();
    selectedFeatures.forEach( selectedFeature => {
      features.forEach( (layer, i) => {
        if(features[i] === selectedFeature) {
          $.ajax({
            url: '/layers/add/',
            method: 'POST',
            data: {
              name: this.state.NameInputValue || "отсутствует",
              geomType: parseFeatures.features[i].geometry.type,
              coord: JSON.stringify(parseFeatures.features[i].geometry.coordinates),
              prop: this.state.DescriptInputValue || "отсутствует"
            },
            success: data => {
              console.log(data);
            },
            error: function(data) {
              $('body').html(data.responseText);
            }
          });
        }
      });
    });
  }

  onSaveFeatures() {
    let features = this.props.vector.getSource().getFeatures();
    let dataFeatures = new ol.format.GeoJSON().writeFeatures(features);
    let parseFeatures = JSON.parse(dataFeatures);
    features.forEach( (layer, i) => {
      $.ajax({
        url: '/layers/add/',
        method: 'POST',
        data: {
          name: this.state.NameInputValue || "пусто",
          geomType: parseFeatures.features[i].geometry.type,
          coord: JSON.stringify(parseFeatures.features[i].geometry.coordinates),
          prop: this.state.DescriptInputValue || "пусто"
        },
        success: data => {
          this.setState({ id: data.id });
          console.log(data);
        },
        error: function(data) {
          $('body').html(data.responseText);
        }
      });
    });
  }

  onGetFeatures() {
    $.ajax({ url: '/layers/get/' })
      .done( res => {
        const featureList = new Array();
        const type = new Array();
        res.forEach( function(layer, i) {
          type[i] = res[i].geomType;
          if (type[i] === "Polygon") {
            featureList[i] = new ol.Feature({
              id: res[i].id,
              Название: res[i].name,
              Описание: res[i].prop,
              geometry: new ol.geom.Polygon(JSON.parse(res[i].coord))
            });
          } else if (type[i] === "Point") {
            featureList[i] = new ol.Feature({
              id: res[i].id,
              Название: res[i].name,
              Описание: res[i].prop,
              geometry: new ol.geom.Point(JSON.parse(res[i].coord))
            });
          } else if (type[i] === "LineString") {
            featureList[i] = new ol.Feature({
              id: res[i].id,
              Название: res[i].name,
              Описание: res[i].prop,
              geometry: new ol.geom.LineString(JSON.parse(res[i].coord))
            });
          }
        });
        this.props.vector.getSource().addFeatures( featureList );
      } )
      .fail( request => {
        alert("Слоёв нет");
      } );
  }

  onDeleteFeature() {
    let vectorSource = this.props.vector.getSource();
    let layerList = this.props.map.getLayers().getArray();
    let indexOfVectorLayer = layerList.findIndex( item => item.get('name') === 'Объекты' );
    let vectorLayerSource = layerList[indexOfVectorLayer].getSource();
    let selectedFeatures = this.props.selectInteraction.getFeatures();
    let number;
    if(number === undefined || this.state.id !== undefined) {
      selectedFeatures.forEach( function(selectedFeature) {
        selectedFeatures.remove(selectedFeature);
        let vectorFeatures = vectorSource.getFeatures();
        vectorFeatures.forEach( function(sourceFeature) {
          if (sourceFeature === selectedFeature) {
            vectorSource.removeFeature(sourceFeature);
          }
        });
        let vectorLayerFeatures = vectorLayerSource.getFeatures();
        vectorLayerFeatures.forEach( function(sourceLayerFeature) {
          if (sourceLayerFeature === selectedFeature) {
            vectorLayerSource.removeFeature(sourceLayerFeature);
          }
        });
        vectorFeatures.forEach( vectorFeature => {
          if(vectorFeature === selectedFeature) {
            number = vectorFeature.get('id');
          }
        });
      });
      $.ajax({
        url: number !== undefined ? '/layers/remove/' + number : '/layers/remove/' + this.state.id,
        type: 'DELETE',
        success: data => {
          this.setState({ id: undefined });
          console.log(data);
        },
        error: function(data) {
          //$('body').html(data.responseText);
          alert("ОШИБКА УДАЛЕНИЯ: Объект отсутствует в базе данных, либо изменён");
        }
      });
    }
  }

  onNameInputChange( event ) {
    this.setState({ NameInputValue: event.target.value });
  }

  onDescriptInputChange( event ) {
    this.setState({ DescriptInputValue: event.target.value });
  }

  render() {
    return <div className="feature-buttons">
      <form className="form-inline">
        <label>Тип геометрии &nbsp;</label>
        <select id="type" className="geometry-menu" onChange={ this.props.onSelectChange }>
          <option value="select">Не выбран</option>
          <option value="point">Точка</option>
          <option value="line">Линия</option>
          <option value="poly">Полигон</option>
          <option value="circle">Круг</option>
          <option value="rectangle">Прямоугольник</option>
        </select>
      </form>
      <h4 style={{ 'fontFamily':'arial', 'color':'white', 'width':'75px', 'display':'inline-block', 'margin':'0 0 0 0' }}>
        Название:</h4>
      <input
        type="text"
        size="28"
        style={{ 'margin':'5px 0 0 10px' }}
        onChange={NameInputValue => this.onNameInputChange(NameInputValue)}/>
      <h4 style={{ 'fontFamily':'arial', 'color':'white', 'width':'75px', 'display':'inline-block', 'margin':'0 0 0 0' }}>
        Описание:</h4>
      <input 
        type="text"
        size="28"
        style={{ 'margin':'5px 0 0 10px' }}
        onChange={DescriptInputValue => this.onDescriptInputChange(DescriptInputValue)}/>
      <button className="cross-button"
        onClick={ this.onRemoveFeature }
        title="Удалить выделенный объект с карты"></button>
      <button className="remove-button"
        onClick={ this.onDeleteFeature }
        title="Удалить выделенный объект из базы данных"></button>
      <button className="text-button"
        onClick={ this.onAddFeature }
        title="Сохранить выделенный объект"></button>
      <button className="upload-button"
        onClick={ this.onSaveFeatures }
        title="Сохранить добавленные объекты"></button>
      <button className="download-button"
        onClick={ this.onGetFeatures }
        title="Загрузить сохранённые объекты"></button>
    </div>;
  }
}