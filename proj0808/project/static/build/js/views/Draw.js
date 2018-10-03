define(['exports', 'react', 'openlayers', 'app/utils', './feature', './FeatureEditor', './GetFeature'], function (exports, _react, _openlayers, _utils, _feature, _FeatureEditor, _GetFeature) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _openlayers2 = _interopRequireDefault(_openlayers);

  var _FeatureEditor2 = _interopRequireDefault(_FeatureEditor);

  var _GetFeature2 = _interopRequireDefault(_GetFeature);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  class Draw extends _react2.default.Component {
    constructor(props) {
      super(props);

      (0, _utils.bind)(this, 'onSelectChange', 'onDrawend', 'setActiveEditing');

      this.state = {
        vectorLayers: this.props.map.getLayers().getArray().filter(layer => layer instanceof _openlayers2.default.layer.Vector)
      };

      this.vector = this.state.vectorLayers[this.state.vectorLayers.length - 1];

      this.props.map.getLayers().on(['add', 'remove'], () => {
        let vectorLayers = this.props.map.getLayers().getArray().filter(layer => layer instanceof _openlayers2.default.layer.Vector);

        this.vector = vectorLayers[vectorLayers.length - 1];

        this.vector.setZIndex(2);

        this.setState({ vectorLayers: vectorLayers });
      });

      this.selectInteraction = new _openlayers2.default.interaction.Select({
        condition: _openlayers2.default.events.condition.click
      });
      this.modifyInteraction = new _openlayers2.default.interaction.Modify({
        features: this.selectInteraction.getFeatures(),
        pixelTolerance: 20
      });
      this.translateInteraction = new _openlayers2.default.interaction.Translate({
        features: this.selectInteraction.getFeatures(),
        hitTolerance: 0
      });
      this.snapInteraction = new _openlayers2.default.interaction.Snap({
        source: this.vector.getSource()
      });
      this.pointInteraction = new _openlayers2.default.interaction.Draw({
        type: 'Point',
        source: this.vector.getSource()
      });
      this.pointInteraction.setActive(false);

      this.lineInteraction = new _openlayers2.default.interaction.Draw({
        type: 'LineString',
        source: this.vector.getSource()
      });
      this.lineInteraction.setActive(false);

      this.polyInteraction = new _openlayers2.default.interaction.Draw({
        type: 'Polygon',
        source: this.vector.getSource()
      });
      this.polyInteraction.setActive(false);

      this.circleInteraction = new _openlayers2.default.interaction.Draw({
        type: 'Circle',
        source: this.vector.getSource(),
        geometryFunction: function (coordinates, geometry) {
          if (!geometry) {
            geometry = new _openlayers2.default.geom.Polygon(null);
          }
          let center = coordinates[0];
          let last = coordinates[1];
          let dx = center[0] - last[0];
          let dy = center[1] - last[1];
          let radius = Math.sqrt(dx * dx + dy * dy);
          let circle = _openlayers2.default.geom.Polygon.circular(new _openlayers2.default.Sphere(6378137), _openlayers2.default.proj.toLonLat(center), radius);
          circle.transform('EPSG:4326', 'EPSG:3857');
          geometry.setCoordinates(circle.getCoordinates());
          return geometry;
        }
      });
      this.circleInteraction.setActive(false);

      this.rectangleInteraction = new _openlayers2.default.interaction.Draw({
        type: 'LineString',
        source: this.vector.getSource(),
        maxPoints: 2,
        geometryFunction: function (coordinates, geometry) {
          if (!geometry) {
            geometry = new _openlayers2.default.geom.Polygon(null);
          }
          let start = coordinates[0];
          let end = coordinates[1];
          geometry.setCoordinates([[start, [start[0], end[1]], end, [end[0], start[1]], start]]);
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

      this.props.map.getInteractions().extend([this.pointInteraction, this.lineInteraction, this.polyInteraction, this.circleInteraction, this.rectangleInteraction, this.selectInteraction, this.modifyInteraction, this.translateInteraction, this.snapInteraction]);
    }

    onSelectChange(event) {
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
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'h4',
          { className: 'headers' },
          '\u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435 \u0438 \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u043E\u0431\u044A\u0435\u043A\u0442\u043E\u0432'
        ),
        _react2.default.createElement(_FeatureEditor2.default, {
          selectInteraction: this.selectInteraction,
          vector: this.vector,
          map: map,
          setActiveEditing: this.setActiveEditing,
          onDrawend: this.onDrawend,
          onSelectChange: this.onSelectChange
        }),
        _react2.default.createElement(_GetFeature2.default, {
          vector: this.vector,
          map: map
        })
      );
    }
  }
  exports.default = Draw;
});