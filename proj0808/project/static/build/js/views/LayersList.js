define(['exports', 'react', './LayersListItem'], function (exports, _react, _LayersListItem) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _LayersListItem2 = _interopRequireDefault(_LayersListItem);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  class LayersList extends _react2.default.Component {
    componentDidMount() {
      this.props.map.getLayers().on(['add', 'remove'], () => this.forceUpdate());
    }
    render() {
      let map = this.props.map;
      let layer;
      if (map === undefined) {
        return null;
      } else {
        let layers = map.getLayers().getArray();
        layer = layers.map((lay, i) => _react2.default.createElement(_LayersListItem2.default, {
          key: 'lay' + i,
          map: map,
          layer: lay,
          layersVisible: this.layersVisible,
          changeOpacityUp: this.changeOpacityUp,
          changeOpacityDown: this.changeOpacityDown,
          layersRemoving: this.layersRemoving
        }));
      }
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'details',
          null,
          _react2.default.createElement(
            'summary',
            { className: 'layers-list' },
            '\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0435 \u043D\u0430 \u043A\u0430\u0440\u0442\u0443 \u0441\u043B\u043E\u0438'
          ),
          layer
        )
      );
    }
  }
  exports.default = LayersList;
});