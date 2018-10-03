import React from 'react';
import ol from 'openlayers';
import { bind } from 'app/utils';
import { geojson } from './feature';
import FeatureEditor from './FeatureEditor';
import GetFeature from './GetFeature';

export default class Draw extends React.Component {
  constructor ( props ) {
    super( props );

    bind( this, 
      'onSelectChange', 
      'onDrawend', 
      'setActiveEditing' );

    this.state = {
      vectorLayers: this.props.map.getLayers().getArray()
        .filter( layer => layer instanceof ol.layer.Vector )
    };

    this.vector = this.state.vectorLayers[this.state.vectorLayers.length-1];

    this.props.map.getLayers().on( ['add', 'remove'], () => {
      let vectorLayers = this.props.map.getLayers().getArray()
        .filter( layer => layer instanceof ol.layer.Vector );
      
      this.vector = vectorLayers[vectorLayers.length-1];

      this.vector.setZIndex(2);

      this.setState({ vectorLayers: vectorLayers });
    } );

    this.selectInteraction = new ol.interaction.Select({
      condition: ol.events.condition.click,
    });
    this.modifyInteraction = new ol.interaction.Modify({
      features: this.selectInteraction.getFeatures(),
      pixelTolerance: 20
    });
    this.translateInteraction = new ol.interaction.Translate({
      features: this.selectInteraction.getFeatures(),
      hitTolerance: 0
    });
    this.snapInteraction = new ol.interaction.Snap({
      source: this.vector.getSource()
    });
    this.pointInteraction = new ol.interaction.Draw({
      type: 'Point',
      source: this.vector.getSource()
    });
    this.pointInteraction.setActive(false);

    this.lineInteraction = new ol.interaction.Draw({
      type: 'LineString',
      source: this.vector.getSource()
    });
    this.lineInteraction.setActive(false);

    this.polyInteraction = new ol.interaction.Draw({
      type: 'Polygon',
      source: this.vector.getSource()
    });
    this.polyInteraction.setActive(false);

    this.circleInteraction = new ol.interaction.Draw({
      type: 'Circle',
      source: this.vector.getSource(),
      geometryFunction: function(coordinates, geometry) {
        if (!geometry) {
          geometry = new ol.geom.Polygon(null);
        }
        let center = coordinates[0];
        let last = coordinates[1];
        let dx = center[0] - last[0];
        let dy = center[1] - last[1];
        let radius = Math.sqrt(dx * dx + dy * dy);
        let circle = ol.geom.Polygon.circular(new ol.Sphere(6378137), ol.proj.toLonLat(center), radius);
        circle.transform('EPSG:4326', 'EPSG:3857');
        geometry.setCoordinates(circle.getCoordinates());
        return geometry;
      }
    });
    this.circleInteraction.setActive(false);

    this.rectangleInteraction = new ol.interaction.Draw({
      type: 'LineString',
      source: this.vector.getSource(),
      maxPoints: 2,
      geometryFunction: function(coordinates, geometry) {
        if (!geometry) {
          geometry = new ol.geom.Polygon(null);
        }
        let start = coordinates[0];
        let end = coordinates[1];
        geometry.setCoordinates([
          [start, [start[0], end[1]], end, [end[0], start[1]], start]
        ]);
        return geometry;
      }
    });
    this.rectangleInteraction.setActive(false);

    this.activeInteraction;
  }

  setActiveEditing(active) {
    this.selectInteraction.getFeatures().clear();
    this.selectInteraction.setActive(active);
    this.modifyInteraction.setActive(active);
    this.translateInteraction.setActive(active);
  }

  onDrawend() {
    this.setActiveEditing(true);
    this.activeInteraction.setActive(false);
  }

  componentDidMount() {
    this.setActiveEditing(true);

    this.props.map.getInteractions().extend([
        this.pointInteraction, this.lineInteraction, this.polyInteraction,
        this.circleInteraction, this.rectangleInteraction, this.selectInteraction,
        this.modifyInteraction, this.translateInteraction, this.snapInteraction]);
  }

  onSelectChange( event ) {
    let type = event.target.value;

    this.pointInteraction.setActive(false);
    this.pointInteraction.on('drawend', this.onDrawend);

    this.lineInteraction.setActive(false);
    this.lineInteraction.on('drawend', this.onDrawend);

    this.polyInteraction.setActive(false);
    this.polyInteraction.on('drawend', this.onDrawend);

    this.circleInteraction.setActive(false);
    this.circleInteraction.on('drawend', this.onDrawend);

    this.rectangleInteraction.setActive(false);
    this.rectangleInteraction.on('drawend', this.onDrawend);

    if (this.activeInteraction) {
      this.activeInteraction.setActive(false);
    }
    if (type === 'point') {
      this.activeInteraction = this.pointInteraction;
    } else if (type === 'line') {
      this.activeInteraction = this.lineInteraction;
    } else if (type === 'poly') {
      this.activeInteraction = this.polyInteraction;
    } else if (type === 'circle') {
      this.activeInteraction = this.circleInteraction;
    } else if (type === 'rectangle') {
      this.activeInteraction = this.rectangleInteraction;
    } else {
      this.activeInteraction = undefined;
    }
    this.setActiveEditing(!this.activeInteraction);
    if (this.activeInteraction) {
      this.activeInteraction.setActive(true);
    }
  }

  render() {
    let map = this.props.map;
    return <div>
      <h4 className="headers">Создание и редактирование объектов</h4>
      <FeatureEditor 
        selectInteraction = {this.selectInteraction}
        vector = {this.vector}
        map = {map}
        setActiveEditing = {this.setActiveEditing}
        onDrawend = {this.onDrawend}
        onSelectChange = {this.onSelectChange}
      />
      <GetFeature 
        vector = {this.vector}
        map = {map}
      />
    </div>;
  }
}