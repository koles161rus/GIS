import React from 'react';
import ol from 'openlayers';
import { bind } from 'app/utils';
import $ from 'jquery';

export default class GetFeature extends React.Component {
  constructor ( props ) {
    super( props );

    bind( this,
      'onGetFeature', 
      'onNameInputChange' );

    this.state = {
      NameInputValue: undefined
    };
  }

  onNameInputChange( event ) {
    this.setState({ NameInputValue: event.target.value });
  }

  onGetFeature( event ) {
    $.ajax({ url: '/layers/get/' })
      .done( res => {
        let feature;
        const type = new Array();
        res.forEach( (layer, i) => {
          type[i] = res[i].geomType;
          if( res[i].name === this.state.NameInputValue ) {
            if (type[i] === "Polygon") {
              feature = new ol.Feature({
                id: res[i].id,
                Название: res[i].name,
                Описание: res[i].prop,
                geometry: new ol.geom.Polygon(JSON.parse(res[i].coord))
              });
            } else if (type[i] === "Point") {
              feature = new ol.Feature({
                id: res[i].id,
                Название: res[i].name,
                Описание: res[i].prop,
                geometry: new ol.geom.Point(JSON.parse(res[i].coord))
              });
            } else if (type[i] === "LineString") {
              feature = new ol.Feature({
                id: res[i].id,
                Название: res[i].name,
                Описание: res[i].prop,
                geometry: new ol.geom.LineString(JSON.parse(res[i].coord))
              });
            }
          }
        });
        this.props.vector.getSource().addFeature( feature );
      } )
      .fail( request => {
        alert("Слоёв нет");
      } );
  }

  render() {
    return <div>
      <h4 style={{ 'fontFamily':'arial', 'color':'white', 'display':'inline-block', 'margin':'0 0 0 10px' }}>
        Добавить объект по названию на карту:</h4>
      <input
        type="text"
        size="34"
        style={{ 'margin':'5px 0 0 10px' }}
        onChange={NameInputValue => this.onNameInputChange(NameInputValue)}/>
      <button
        className="add-button"
        title='Добавить объект на карту'
        onClick={this.onGetFeature}></button>
    </div>;
  }
}