import React from 'react';
import ol from 'openlayers';
import $ from 'jquery';

export default class TilesCollectionItem extends React.Component {
  layersAdding(lay) {
    let number = lay.get('id');
    let map = this.props.map;
    let layers = map.getLayers().getArray();
    let check = layers.find( layer => layer.get('name') === lay.get('name') );
    if(!check) {
      map.addLayer(lay);
    } else {
      console.log('Слой уже добавлен');
    }
  }
  layersRemoving(lay) {
    let number = lay.get('id');
    lay instanceof ol.layer.Tile && $.ajax({
      url: '/layers/delete/' + number,
      type: 'DELETE',
      success: data => {
        this.props.deleteLayer(number, lay);
        console.log(data);
      },
      error: function(data) {
        $('body').html(data.responseText);
      }
    });
    lay instanceof ol.layer.Vector && $.ajax({
      url: '/layers/delvector/' + number,
      type: 'DELETE',
      success: data => {
        this.props.deleteLayer(number, lay);
        console.log(data);
      },
      error: function(data) {
        //$('body').html(data.responseText);
        alert("ОШИБКА УДАЛЕНИЯ: Слой отсутствует в базе данных");
      }
    });
  }
  render() {
    let map = this.props.map;
    let lay = this.props.layer;
    let number = lay.get('id');
    return <div>
      {
        lay instanceof ol.layer.Tile &&
        <h4 style={{ 'fontFamily':'arial', 'color':'white', 'display':'inline-block', 'width':'40%', 'margin':'10px 0 0 10px' }}>
          {lay.get('name')}</h4>
      }
      {
        lay instanceof ol.layer.Vector &&
        <h4 style={{ 'fontFamily':'arial', 'color':'white', 'display':'inline-block', 'width':'72%', 'margin':'10px 0 0 10px' }}>
          {lay.get('name')}</h4>
      }
        {
          lay instanceof ol.layer.Tile &&
          <button
            className="yandex-button"
            title='Установить проекцию яндекса'
            onClick={ () => this.props.yandexProjection(number) }></button>
        }
        {
          lay instanceof ol.layer.Tile &&
          <button
            className="proj-button"
            title='Установить стандартную проекцию'
            onClick={ () => this.props.standartProjection(number) }></button>
        }
        {
          lay instanceof ol.layer.Tile &&
          <button
            className="quad-button"
            title='Применить расшифровку QuadKey'
            onClick={ () => this.props.addQuad(number) }></button>
        }
        <button
          className="add-button"
          title='Добавить слой'
          onClick={ () => this.layersAdding(lay) }></button>
        <button
          className="delete-button"
          title='Удалить слой'
          onClick={ () => this.layersRemoving(lay) }></button>
    </div>;
  }
}