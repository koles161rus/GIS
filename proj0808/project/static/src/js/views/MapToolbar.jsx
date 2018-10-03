import React from 'react';
import ol from 'openlayers';
import { bind, saveToLocalStorage, getFromLocalStorage } from 'app/utils';

export default class MapToolbar extends React.Component {
  constructor (props) {
    super( props );

    bind( this,
      'zoomIn',
      'zoomOut',
      'startingPoint',
      'setProjection',
      'prevExtent',
      'nextExtent',
      'goToExtentInHistory',
      'saveExtentsToLocalStorage',
      'loadExtentsFromLocalStorage',
      'initExtentHistory'
    );

    this.mapAnimationDuration = 200;
    
    let { extents, currentExtentIndex } = this.loadExtentsFromLocalStorage();
    if( extents ) {
      this.suppressNextMoveEnd = true;
    }

    this.extents = extents || [];
    
    this.state = {
      activeToolName: null,
      currentExtentIndex: currentExtentIndex || 0
    };

    this.initExtentHistory();
  }

  zoomIn() {
    let mapView = this.props.map.getView();

    mapView.animate( {
      zoom: mapView.getZoom() + 1,
      duration: this.mapAnimationDuration
    } );
  }
  zoomOut() {
    let mapView = this.props.map.getView();

    mapView.animate( {
      zoom: mapView.getZoom() - 1,
      duration: this.mapAnimationDuration
    } );
  }

  startingPoint() {
    let ext = window.projectSettings && window.projectSettings.DEFAULT_MAP_EXTENT;
    if( ext ) {
      ext = ol.proj.transformExtent( ext, 'EPSG:3857', this.props.map.getView().getProjection() );
      this.props.map.getView().fit(
        ext,
        this.props.map.getSize(),
        { duration: this.mapAnimationDuration }
      );
    }
    else {
      this.props.map.getView().animate({
        center: ol.proj.transform([4330710, 5972970], 'EPSG:3857', this.props.map.getView().getProjection()),
        zoom: 14,
        duration: this.mapAnimationDuration
      });
    }
  }

  setProjection() {
    let map = this.props.map;
    let oldProj = map.getView().getProjection().getCode();
    let newProj;
    if(map.getView().getProjection().getCode() === 'EPSG:3857') {
      newProj = 'EPSG:4326';
    } else {
      newProj = 'EPSG:3857';
    }

    map.getLayers().forEach( layer => {
      let extent = layer.getExtent();
      if( extent !== undefined ) {
        let newExtent = ol.proj.transformExtent( layer.wgs84extent, oldProj, newProj );
        layer.setExtent( newExtent );
      }
      let source = layer.getSource();
      if(source instanceof ol.source.Vector) {
        source.forEachFeature( feature => {
          feature.getGeometry().transform(oldProj, newProj);
        });
      }
      else {
        source.refresh();
      }
    });

    this.extents.forEach( (e,i) => {
      this.extents[i].center = ol.proj.transform(e.center, oldProj, newProj);
    });
    this.suppressNextMoveEnd = true;

    map.setView( new ol.View({
      projection: newProj,
      center: ol.proj.transform( map.getView().getCenter(), oldProj, newProj ),
      zoom: map.getView().getZoom()
    }) );
  }

  initExtentHistory() {
    this.extentHistoryMaxLength = 70;
    this.extentHistoryLengthTreshhold = 30;

    window.addEventListener( 'beforeunload', this.saveExtentsToLocalStorage );

    this.props.map.on('moveend', event => {
      if( this.suppressNextMoveEnd ) {
        this.suppressNextMoveEnd = false;
      }
      else {
        if( this.state.currentExtentIndex < this.extents.length - 1 ) {
          this.extents = this.extents.slice(0, this.state.currentExtentIndex + 1);
        }

        let view = event.map.getView();

        this.extents.push({
          center: view.getCenter(),
          zoom: view.getZoom()
        });

        if( this.extents.length > this.extentHistoryMaxLength ) {
          this.extents = this.extents.slice( this.extentHistoryLengthTreshhold, this.extents.length );
          this.saveExtentsToLocalStorage();
        }

        this.setState({ currentExtentIndex: this.extents.length-1 });
      }
    });
  }

  loadExtentsFromLocalStorage() {
    let extents = getFromLocalStorage('extentHistory');
    let currentExtentIndex = getFromLocalStorage('extentHistoryExtentIndex');
    if( extents && currentExtentIndex !== undefined ) {
      extents.forEach( extent => {
        extent.center = ol.proj.transform(extent.center, 'EPSG:3857', this.props.map.getView().getProjection());
      });

      return {
        extents: extents,
        currentExtentIndex: currentExtentIndex
      };
    }
    return {};
  }

  saveExtentsToLocalStorage() {
    let extents = this.extents.map( extent => ({
      zoom: extent.zoom,
      center: ol.proj.transform( extent.center, this.props.map.getView().getProjection(), 'EPSG:3857' )
    }));

    saveToLocalStorage( 'extentHistory', extents );
    saveToLocalStorage( 'extentHistoryExtentIndex', this.state.currentExtentIndex );
  }

  goToExtentInHistory( index ) {
    let view = this.props.map.getView();
    let extent = this.extents[ index ];
    this.suppressNextMoveEnd = true;
    view.animate({
      ...extent,
      duration: this.mapAnimationDuration
    });
    this.setState({ currentExtentIndex: index });
  }

  prevExtent() {
    let prevExtentIndex = this.state.currentExtentIndex - 1;
    if( prevExtentIndex >= 0 ) {
      this.goToExtentInHistory( prevExtentIndex );
    }
  }

  nextExtent() {
    let nextExtentIndex = this.state.currentExtentIndex + 1;
    if( nextExtentIndex <= this.extents.length - 1 ) {
      this.goToExtentInHistory( nextExtentIndex );
    }
  }

  render () {
    let {
      props: {
        map
      }
    } = this;
    return <div className='menu-buttons'>
      <button
        className='zoom-in'
        onClick={this.zoomIn}
        title='Приблизить'
      ></button>
      <button
        className='zoom-out'
        onClick={this.zoomOut}
        title='Отдалить'
      ></button>
      <button
        className='starting-point'
        onClick={this.startingPoint}
        title='Вернуться в начальную точку'
      ></button>
      <button
        className='set-projection'
        onClick={this.setProjection}
        title='Изменить проекцию'
      ></button>
      <button
        className='prev-extent'
        onClick={this.prevExtent}
        title='Вернуться назад'
      ></button>
      <button
        className='next-extent'
        onClick={this.nextExtent}
        title='Вернуться вперёд'
      ></button>
    </div>;
  }
}