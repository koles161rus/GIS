define(['exports', 'react', 'openlayers', 'jquery'], function (exports, _react, _openlayers, _jquery) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _openlayers2 = _interopRequireDefault(_openlayers);

  var _jquery2 = _interopRequireDefault(_jquery);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  class TilesCollectionItem extends _react2.default.Component {
    layersAdding(lay) {
      let number = lay.get('id');
      let map = this.props.map;
      let layers = map.getLayers().getArray();
      let check = layers.find(layer => layer.get('name') === lay.get('name'));
      if (!check) {
        map.addLayer(lay);
      } else {
        console.log('Слой уже добавлен');
      }
    }
    layersRemoving(lay) {
      let number = lay.get('id');
      lay instanceof _openlayers2.default.layer.Tile && _jquery2.default.ajax({
        url: '/layers/delete/' + number,
        type: 'DELETE',
        success: data => {
          this.props.deleteLayer(number, lay);
          console.log(data);
        },
        error: function (data) {
          (0, _jquery2.default)('body').html(data.responseText);
        }
      });
      lay instanceof _openlayers2.default.layer.Vector && _jquery2.default.ajax({
        url: '/layers/delvector/' + number,
        type: 'DELETE',
        success: data => {
          this.props.deleteLayer(number, lay);
          console.log(data);
        },
        error: function (data) {
          //$('body').html(data.responseText);
          alert("ОШИБКА УДАЛЕНИЯ: Слой отсутствует в базе данных");
        }
      });
    }
    render() {
      let map = this.props.map;
      let lay = this.props.layer;
      let number = lay.get('id');
      return _react2.default.createElement(
        'div',
        null,
        lay instanceof _openlayers2.default.layer.Tile && _react2.default.createElement(
          'h4',
          { style: { 'fontFamily': 'arial', 'color': 'white', 'display': 'inline-block', 'width': '40%', 'margin': '10px 0 0 10px' } },
          lay.get('name')
        ),
        lay instanceof _openlayers2.default.layer.Vector && _react2.default.createElement(
          'h4',
          { style: { 'fontFamily': 'arial', 'color': 'white', 'display': 'inline-block', 'width': '72%', 'margin': '10px 0 0 10px' } },
          lay.get('name')
        ),
        lay instanceof _openlayers2.default.layer.Tile && _react2.default.createElement('button', {
          className: 'yandex-button',
          title: '\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u043F\u0440\u043E\u0435\u043A\u0446\u0438\u044E \u044F\u043D\u0434\u0435\u043A\u0441\u0430',
          onClick: () => this.props.yandexProjection(number) }),
        lay instanceof _openlayers2.default.layer.Tile && _react2.default.createElement('button', {
          className: 'proj-button',
          title: '\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043D\u0443\u044E \u043F\u0440\u043E\u0435\u043A\u0446\u0438\u044E',
          onClick: () => this.props.standartProjection(number) }),
        lay instanceof _openlayers2.default.layer.Tile && _react2.default.createElement('button', {
          className: 'quad-button',
          title: '\u041F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C \u0440\u0430\u0441\u0448\u0438\u0444\u0440\u043E\u0432\u043A\u0443 QuadKey',
          onClick: () => this.props.addQuad(number) }),
        _react2.default.createElement('button', {
          className: 'add-button',
          title: '\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0441\u043B\u043E\u0439',
          onClick: () => this.layersAdding(lay) }),
        _react2.default.createElement('button', {
          className: 'delete-button',
          title: '\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0441\u043B\u043E\u0439',
          onClick: () => this.layersRemoving(lay) })
      );
    }
  }
  exports.default = TilesCollectionItem;
});