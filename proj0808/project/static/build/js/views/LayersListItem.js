define(['exports', 'react', 'openlayers'], function (exports, _react, _openlayers) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _openlayers2 = _interopRequireDefault(_openlayers);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  class LayersListItem extends _react2.default.Component {
    layersVisible(lay) {
      if (lay.getVisible() === true) {
        lay.setVisible(false);
      } else {
        lay.setVisible(true);
      }
    }
    changeOpacity(lay, event) {
      lay.setOpacity(event.target.value);
      this.forceUpdate();
    }
    layersRemoving(lay) {
      let map = this.props.map;
      map.removeLayer(lay);
    }
    render() {
      let lay = this.props.layer;
      let id = 'checkbox_' + lay.get('name');
      return _react2.default.createElement(
        'div',
        { style: { 'height': '35px' } },
        _react2.default.createElement(
          'h4',
          { style: { 'fontFamily': 'arial', 'color': 'white', 'display': 'inline-block', 'width': '35%', 'margin': '0 0 0 10px' } },
          lay.get('name')
        ),
        _react2.default.createElement(
          'label',
          {
            className: 'switch',
            title: '\u0412\u043A\u043B/\u0432\u044B\u043A\u043B \u0441\u043B\u043E\u0439',
            htmlFor: id,
            onChange: () => this.layersVisible(lay) },
          _react2.default.createElement('input', {
            type: 'checkbox',
            id: id }),
          _react2.default.createElement('div', { className: 'slider round' })
        ),
        _react2.default.createElement('button', {
          className: 'delete-button',
          title: '\u0423\u0431\u0440\u0430\u0442\u044C \u0441\u043B\u043E\u0439',
          onClick: () => this.layersRemoving(lay) }),
        _react2.default.createElement('input', {
          title: '\u041F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u043E\u0441\u0442\u044C \u0441\u043B\u043E\u044F',
          style: { 'width': '20%', 'margin': '0 0 0 10px' },
          type: 'range',
          onInput: event => this.changeOpacity(lay, event),
          min: '0',
          max: '1',
          step: '0.01',
          value: lay.getOpacity() }),
        _react2.default.createElement(
          'h4',
          { style: { 'fontFamily': 'arial', 'color': 'white', 'display': 'inline-block' } },
          '\xA0 ',
          parseInt(lay.getOpacity() * 100) + "%"
        )
      );
    }
  }
  exports.default = LayersListItem;
});