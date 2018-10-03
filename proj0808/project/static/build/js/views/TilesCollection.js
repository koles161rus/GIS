define(['exports', 'react', 'openlayers', 'app/utils', 'proj4', 'jquery', './TilesCollectionItem', './AddTiles', './AddVector', './feature'], function (exports, _react, _openlayers, _utils, _proj, _jquery, _TilesCollectionItem, _AddTiles, _AddVector, _feature) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _openlayers2 = _interopRequireDefault(_openlayers);

  var _proj2 = _interopRequireDefault(_proj);

  var _jquery2 = _interopRequireDefault(_jquery);

  var _TilesCollectionItem2 = _interopRequireDefault(_TilesCollectionItem);

  var _AddTiles2 = _interopRequireDefault(_AddTiles);

  var _AddVector2 = _interopRequireDefault(_AddVector);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  class TilesCollection extends _react2.default.Component {
    constructor(props) {
      super(props);

      (0, _utils.bind)(this, 'deleteLayer', 'addLayer', 'addVector', 'yandexProjection', 'standartProjection', 'getQuad', 'addQuad', 'onSelectChange');

      this.state = {
        tileList: undefined,
        vectorList: undefined,
        add: undefined
      };
    }
    deleteLayer(id, layer) {
      let layerIndex;
      if (layer instanceof _openlayers2.default.layer.Tile) {
        layerIndex = this.state.tileList.findIndex(lay => lay.get('id') === id);
        this.state.tileList.splice(layerIndex, 1);
      } else {
        layerIndex = this.state.vectorList.findIndex(lay => lay.get('id') === id);
        this.state.vectorList.splice(layerIndex, 1);
      }
      this.forceUpdate();
    }
    addLayer(id, name, url) {
      this.state.tileList.push(new _openlayers2.default.layer.Tile({
        id: id,
        name: name,
        source: new _openlayers2.default.source.XYZ({
          url: url
        })
      }));
      this.forceUpdate();
    }
    addVector(id, name, red, green, blue, alpha, width, radius) {
      this.state.vectorList.push(new _openlayers2.default.layer.Vector({
        id: id,
        name: name,
        source: new _openlayers2.default.source.Vector(),
        style: new _openlayers2.default.style.Style({
          fill: new _openlayers2.default.style.Fill({
            color: 'rgba(' + red + ',' + green + ',' + blue + ',' + alpha + ')'
          }),
          stroke: new _openlayers2.default.style.Stroke({
            color: 'rgb(' + red + ',' + green + ',' + blue + ')',
            width: width
          }),
          image: new _openlayers2.default.style.Circle({
            radius: radius,
            fill: new _openlayers2.default.style.Fill({
              color: 'rgb(' + red + ',' + green + ',' + blue + ')'
            })
          })
        })
      }));
      this.forceUpdate();
    }
    yandexProjection(id) {
      let layerIndex = this.state.tileList.findIndex(lay => lay.get('id') === id);
      _openlayers2.default.proj.setProj4(_proj2.default);
      _proj2.default.defs('EPSG:3395', '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs');
      let proj = _openlayers2.default.proj.get('EPSG:3395');
      proj.setExtent([-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244]);
      let url = this.state.tileList[layerIndex].getSource().getUrls().join();
      let source = new _openlayers2.default.source.XYZ({
        url: url,
        projection: proj
      });
      this.state.tileList[layerIndex].setSource(source);
    }
    standartProjection(id) {
      let layerIndex = this.state.tileList.findIndex(lay => lay.get('id') === id);
      let url = this.state.tileList[layerIndex].getSource().getUrls().join();
      let source = new _openlayers2.default.source.XYZ({
        url: url,
        projection: 'EPSG:3857'
      });
      this.state.tileList[layerIndex].setSource(source);
    }
    componentDidMount() {
      _jquery2.default.ajax({ url: '/layers/' }).done(res => {
        const tileList = new Array();
        res.forEach(function (layer, i) {
          tileList[i] = new _openlayers2.default.layer.Tile({
            id: res[i].id,
            name: res[i].name,
            source: new _openlayers2.default.source.XYZ({
              url: res[i].url
            })
          });
        });
        this.setState({ tileList: tileList });
      }).fail(request => {
        console.log("Слоёв нет");
      });
      _jquery2.default.ajax({ url: '/layers/getvector' }).done(res => {
        const vectorList = new Array();
        res.forEach(function (layer, i) {
          vectorList[i] = new _openlayers2.default.layer.Vector({
            id: res[i].id,
            name: res[i].name,
            source: new _openlayers2.default.source.Vector(),
            style: new _openlayers2.default.style.Style({
              fill: new _openlayers2.default.style.Fill({
                color: 'rgba(' + res[i].red + ',' + res[i].green + ',' + res[i].blue + ',' + res[i].alpha + ')'
              }),
              stroke: new _openlayers2.default.style.Stroke({
                color: 'rgb(' + res[i].red + ',' + res[i].green + ',' + res[i].blue + ')',
                width: res[i].width
              }),
              image: new _openlayers2.default.style.Circle({
                radius: res[i].radius,
                fill: new _openlayers2.default.style.Fill({
                  color: 'rgb(' + res[i].red + ',' + res[i].green + ',' + res[i].blue + ')'
                })
              })
            })
          });
        });
        this.setState({ vectorList: vectorList });
      }).fail(request => {
        console.log("Слоёв нет");
      });
    }
    getQuad(x, y) {
      let z = this.props.map.getView().getZoom();
      let index = '';
      for (let i = 0; i < 2 * z + 2; i++) {
        let value = function () {
          if (i % 2 === 0) return 0;
          let step = Math.pow(2, (i + 1) / 2);
          if (y % step >= step / 2) return 1;
          return 0;
        }();
        index = value + index;
      }
      let diff = parseInt(index, 2).toString(4);
      let xx = x.toString(2);

      let ans = parseInt(xx, 10) + parseInt(diff, 10);
      ans = ans.toString();
      while (ans.length < z) ans = '0' + ans;
      return ans;
    }
    addQuad(id) {
      let layerIndex = this.state.tileList.findIndex(lay => lay.get('id') === id);
      let url = this.state.tileList[layerIndex].getSource().getUrls().join();
      let source = new _openlayers2.default.source.XYZ({
        tileUrlFunction: coord => {
          return url.replace('{x}', this.getQuad(coord[1], -coord[2] - 1));
        }
      });
      this.state.tileList[layerIndex].setSource(source);
    }
    onSelectChange(event) {
      let type = event.target.value;
      if (type === 'raster') {
        this.setState({ add: _react2.default.createElement(_AddTiles2.default, { addLayer: this.addLayer }) });
      } else if (type === 'vector') {
        this.setState({ add: _react2.default.createElement(_AddVector2.default, { addVector: this.addVector }) });
      } else {
        this.setState({ add: undefined });
      }
    }
    render() {
      var _state = this.state;
      let tileList = _state.tileList,
          vectorList = _state.vectorList,
          add = _state.add;

      let map = this.props.map;
      let vector;
      let layer;
      if (map === undefined) {
        return null;
      } else {
        if (tileList === undefined) {
          return null;
        } else {
          layer = tileList.map((lay, i) => _react2.default.createElement(_TilesCollectionItem2.default, {
            key: i,
            deleteLayer: this.deleteLayer,
            map: map,
            layer: lay,
            layersAdding: this.layersAdding,
            yandexProjection: this.yandexProjection,
            standartProjection: this.standartProjection,
            addQuad: this.addQuad
          }));
        }
        if (vectorList === undefined) {
          return null;
        } else {
          vector = vectorList.map((lay, i) => _react2.default.createElement(_TilesCollectionItem2.default, {
            key: i,
            deleteLayer: this.deleteLayer,
            map: map,
            layer: lay,
            layersAdding: this.layersAdding
          }));
        }
      }
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'form',
          { className: 'form-inline', style: { 'display': 'inline-block', 'margin': '0 0 5px 10px' } },
          _react2.default.createElement(
            'label',
            null,
            '\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0442\u0438\u043F \u0441\u043B\u043E\u044F \xA0'
          ),
          _react2.default.createElement(
            'select',
            { id: 'type', className: 'geometry-menu', onChange: this.onSelectChange },
            _react2.default.createElement(
              'option',
              { value: 'select' },
              '\u041D\u0435 \u0432\u044B\u0431\u0440\u0430\u043D'
            ),
            _react2.default.createElement(
              'option',
              { value: 'raster' },
              '\u0420\u0430\u0441\u0442\u0440\u043E\u0432\u044B\u0439'
            ),
            _react2.default.createElement(
              'option',
              { value: 'vector' },
              '\u0412\u0435\u043A\u0442\u043E\u0440\u043D\u044B\u0439'
            )
          )
        ),
        add,
        _react2.default.createElement(
          'details',
          null,
          _react2.default.createElement(
            'summary',
            { className: 'layers-list' },
            '\u0417\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u043D\u044B\u0435 \u0440\u0430\u0441\u0442\u0440\u043E\u0432\u044B\u0435 \u0441\u043B\u043E\u0438'
          ),
          layer
        ),
        _react2.default.createElement(
          'details',
          null,
          _react2.default.createElement(
            'summary',
            { className: 'layers-list' },
            '\u0417\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u043D\u044B\u0435 \u0432\u0435\u043A\u0442\u043E\u0440\u043D\u044B\u0435 \u0441\u043B\u043E\u0438'
          ),
          vector
        )
      );
    }
  }
  exports.default = TilesCollection;
});