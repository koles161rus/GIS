define(['exports', 'react', 'openlayers', 'app/utils', 'jquery'], function (exports, _react, _openlayers, _utils, _jquery) {
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

  class GetFeature extends _react2.default.Component {
    constructor(props) {
      super(props);

      (0, _utils.bind)(this, 'onGetFeature', 'onNameInputChange');

      this.state = {
        NameInputValue: undefined
      };
    }

    onNameInputChange(event) {
      this.setState({ NameInputValue: event.target.value });
    }

    onGetFeature(event) {
      _jquery2.default.ajax({ url: '/layers/get/' }).done(res => {
        let feature;
        const type = new Array();
        res.forEach((layer, i) => {
          type[i] = res[i].geomType;
          if (res[i].name === this.state.NameInputValue) {
            if (type[i] === "Polygon") {
              feature = new _openlayers2.default.Feature({
                id: res[i].id,
                Название: res[i].name,
                Описание: res[i].prop,
                geometry: new _openlayers2.default.geom.Polygon(JSON.parse(res[i].coord))
              });
            } else if (type[i] === "Point") {
              feature = new _openlayers2.default.Feature({
                id: res[i].id,
                Название: res[i].name,
                Описание: res[i].prop,
                geometry: new _openlayers2.default.geom.Point(JSON.parse(res[i].coord))
              });
            } else if (type[i] === "LineString") {
              feature = new _openlayers2.default.Feature({
                id: res[i].id,
                Название: res[i].name,
                Описание: res[i].prop,
                geometry: new _openlayers2.default.geom.LineString(JSON.parse(res[i].coord))
              });
            }
          }
        });
        this.props.vector.getSource().addFeature(feature);
      }).fail(request => {
        alert("Слоёв нет");
      });
    }

    render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'h4',
          { style: { 'fontFamily': 'arial', 'color': 'white', 'display': 'inline-block', 'margin': '0 0 0 10px' } },
          '\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043E\u0431\u044A\u0435\u043A\u0442 \u043F\u043E \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044E \u043D\u0430 \u043A\u0430\u0440\u0442\u0443:'
        ),
        _react2.default.createElement('input', {
          type: 'text',
          size: '34',
          style: { 'margin': '5px 0 0 10px' },
          onChange: NameInputValue => this.onNameInputChange(NameInputValue) }),
        _react2.default.createElement('button', {
          className: 'add-button',
          title: '\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043E\u0431\u044A\u0435\u043A\u0442 \u043D\u0430 \u043A\u0430\u0440\u0442\u0443',
          onClick: this.onGetFeature })
      );
    }
  }
  exports.default = GetFeature;
});