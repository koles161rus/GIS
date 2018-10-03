import React from 'react';
import LayersListItem from './LayersListItem';

export default class LayersList extends React.Component {
  componentDidMount() {
    this.props.map.getLayers().on( ['add', 'remove'], () => this.forceUpdate() );
  }
  render() {
    let map = this.props.map;
    let layer;
    if(map === undefined) {
      return null;
    } else {
      let layers = map.getLayers().getArray();
      layer = layers.map( (lay, i) => 
        <LayersListItem
          key={'lay'+i} 
          map = {map}
          layer = {lay}
          layersVisible = {this.layersVisible}
          changeOpacityUp = {this.changeOpacityUp}
          changeOpacityDown = {this.changeOpacityDown}
          layersRemoving = {this.layersRemoving}
        /> 
      );
    }
    return <div>
      <details>
        <summary className='layers-list'>Добавленные на карту слои</summary>
        {layer}
      </details>
    </div>;
  }
}
