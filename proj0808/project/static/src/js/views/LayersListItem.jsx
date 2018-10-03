import React from 'react';
import ol from 'openlayers';

export default class LayersListItem extends React.Component {
  layersVisible(lay) {
    if (lay.getVisible() === true) {
      lay.setVisible(false);
    } else {
      lay.setVisible(true);
    }
  }
  changeOpacity(lay, event) {
    lay.setOpacity( event.target.value );
    this.forceUpdate();
  }
  layersRemoving(lay) {
    let map = this.props.map;
    map.removeLayer(lay);
  }
  render() {
    let lay = this.props.layer;
    let id = 'checkbox_'+lay.get('name');
    return (
      <div style={{ 'height':'35px' }}>
        <h4 style={{ 'fontFamily':'arial', 'color':'white', 'display':'inline-block', 'width':'35%', 'margin':'0 0 0 10px' }}>
          {lay.get('name')}</h4>
          <label
            className="switch"
            title='Вкл/выкл слой'
            htmlFor={id}
            onChange={ () => this.layersVisible(lay) }>
            <input
              type="checkbox"
              id={id} />
            <div className="slider round"></div>
          </label>
          <button
            className="delete-button"
            title='Убрать слой'
            onClick={ () => this.layersRemoving(lay) }></button>
          <input
            title='Прозрачность слоя'
            style={{ 'width':'20%', 'margin':'0 0 0 10px' }}
            type="range"
            onInput={ event => this.changeOpacity(lay, event) }
            min = '0'
            max = '1'
            step = '0.01'
            value={ lay.getOpacity() }/>
          <h4 style={{ 'fontFamily':'arial', 'color':'white', 'display':'inline-block' }}>&nbsp; {parseInt(lay.getOpacity()*100) + "%"}</h4>
      </div>
    );
  }
}