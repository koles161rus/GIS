define(['exports', 'react', 'openlayers', 'app/utils', './feature', 'proj4', 'jquery'], function (exports, _react, _openlayers, _utils, _feature2, _proj, _jquery) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _openlayers2 = _interopRequireDefault(_openlayers);

  var _proj2 = _interopRequireDefault(_proj);

  var _jquery2 = _interopRequireDefault(_jquery);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  class Map extends _react2.default.Component {
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

      let view1 = new _openlayers2.default.View({
        projection: projection1,
        center: _openlayers2.default.proj.transform(center, 'EPSG:3857', 'EPSG:4326'),
        zoom: zoom,
        minZoom: minZoom,
        maxZoom: maxZoom
      });

      let view2 = new _openlayers2.default.View({
        projection: projection2,
        center: center,
        zoom: zoom,
        minZoom: minZoom,
        maxZoom: maxZoom
      });

      let map = new _openlayers2.default.Map({
        target: 'ol-map',
        view: view2,
        controls: [new _openlayers2.default.control.MousePosition()]
      });

      const vectorLayer = new _openlayers2.default.layer.Vector({
        name: 'Объекты',
        source: new _openlayers2.default.source.Vector({
          features: new _openlayers2.default.format.GeoJSON().readFeatures(_feature2.geojson)
        }),
        style: new _openlayers2.default.style.Style({
          fill: new _openlayers2.default.style.Fill({
            color: 'rgba(128, 0, 0, 0.2)'
          }),
          stroke: new _openlayers2.default.style.Stroke({
            color: '#800000',
            width: 2
          }),
          image: new _openlayers2.default.style.Circle({
            radius: 7,
            fill: new _openlayers2.default.style.Fill({
              color: '#800000'
            })
          })
        })
      });

      vectorLayer.setZIndex(1);

      map.addLayer(vectorLayer);

      let _this = this;
      map.on('click', function (event) {

        let feature;
        map.forEachFeatureAtPixel(event.pixel, function (_feature, layer) {
          feature = _feature;
        });
        _this.props.setFeature(feature);

        //_this.rosreestrRequest(event);
      });

      this.props.setMap(map);

      window.mapDev = {
        map: map,
        ol: _openlayers2.default
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
      return _react2.default.createElement('div', { id: 'ol-map', className: 'map' });
    }
  }
  exports.default = Map;
});