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

  class AddTiles extends _react2.default.Component {
    constructor(props) {
      super(props);

      (0, _utils.bind)(this, 'onClickButton');

      this.state = {
        NameInputValue: undefined,
        URLInputValue: undefined
      };
    }
    onNameInputChange(event) {
      this.setState({ NameInputValue: event.target.value });
    }
    onURLInputChange(event) {
      this.setState({ URLInputValue: event.target.value });
    }
    onClickButton(event) {
      _jquery2.default.ajax({
        url: '/layers/tiles/',
        method: 'POST',
        data: {
          name: this.state.NameInputValue || "Без Названия",
          url: this.state.URLInputValue || "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        },
        success: data => {
          this.props.addLayer(data.id, this.state.NameInputValue || "Без Названия", this.state.URLInputValue || "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png");
          console.log(data);
        },
        error: function (data) {
          //$('body').html(data.responseText);
          alert("ОШИБКА ДОБАВЛЕНИЯ: Слишком длинное название или url (макс. 256 знаков)");
        }
      });
    }
    render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'h4',
          { style: { 'fontFamily': 'arial', 'color': 'white', 'width': '75px', 'display': 'inline-block', 'margin': '0 0 0 10px' } },
          '\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435:'
        ),
        _react2.default.createElement('input', {
          type: 'text',
          size: '28',
          placeholder: '\u0411\u0435\u0437 \u041D\u0430\u0437\u0432\u0430\u043D\u0438\u044F',
          style: { 'margin': '0 0 5px 10px' },
          onChange: NameInputValue => this.onNameInputChange(NameInputValue) }),
        _react2.default.createElement(
          'h4',
          { style: { 'fontFamily': 'arial', 'color': 'white', 'width': '75px', 'display': 'inline-block', 'margin': '0 0 0 10px' } },
          'URL:'
        ),
        _react2.default.createElement('input', {
          type: 'text',
          size: '28',
          placeholder: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          style: { 'margin': '0 0 5px 10px' },
          onChange: URLInputValue => this.onURLInputChange(URLInputValue) }),
        _react2.default.createElement(
          'button',
          {
            className: 'geometry-menu',
            style: { 'width': '200px', 'display': 'block' },
            onClick: this.onClickButton },
          '\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043D\u043E\u0432\u044B\u0439 \u0441\u043B\u043E\u0439'
        )
      );
    }
  }
  exports.default = AddTiles;
});