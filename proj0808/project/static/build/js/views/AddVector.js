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

  class AddVector extends _react2.default.Component {
    constructor(props) {
      super(props);

      (0, _utils.bind)(this, 'onAddVector', 'onNameInputChange', 'onRedInputChange', 'onGreenInputChange', 'onBlueInputChange', 'onAlphaInputChange', 'onWidthInputChange', 'onRadiusInputChange');

      this.state = {
        NameInputValue: undefined,
        RedInputValue: undefined,
        GreenInputValue: undefined,
        BlueInputValue: undefined,
        AlphaInputValue: undefined,
        WidthInputValue: undefined,
        RadiusInputValue: undefined
      };
    }
    onNameInputChange(event) {
      this.setState({ NameInputValue: event.target.value });
    }
    onRedInputChange(event) {
      if (event.target.value < 256) {
        debugger;
        this.setState({ RedInputValue: event.target.value });
      } else {
        alert("ВНИМАНИЕ: Значение не должно превышать 255");
        this.setState({ RedInputValue: undefined });
      }
    }
    onGreenInputChange(event) {
      if (event.target.value < 256) {
        this.setState({ GreenInputValue: event.target.value });
      } else {
        alert("ВНИМАНИЕ: Значение не должно превышать 255");
        this.setState({ GreenInputValue: undefined });
      }
    }
    onBlueInputChange(event) {
      if (event.target.value < 256) {
        this.setState({ BlueInputValue: event.target.value });
      } else {
        alert("ВНИМАНИЕ: Значение не должно превышать 255");
        this.setState({ BlueInputValue: undefined });
      }
    }
    onAlphaInputChange(event) {
      if (event.target.value < 101) {
        this.setState({ AlphaInputValue: event.target.value });
      } else {
        alert("ВНИМАНИЕ: Значение не должно превышать 100");
        this.setState({ BlueInputValue: undefined });
      }
    }
    onWidthInputChange(event) {
      this.setState({ WidthInputValue: event.target.value });
    }
    onRadiusInputChange(event) {
      this.setState({ RadiusInputValue: event.target.value });
    }
    onAddVector(event) {
      _jquery2.default.ajax({
        url: '/layers/addvector/',
        method: 'POST',
        data: {
          name: this.state.NameInputValue || "Без названия",
          alpha: this.state.AlphaInputValue / 100 || "0.2",
          blue: this.state.BlueInputValue || "0",
          green: this.state.GreenInputValue || "127",
          radius: this.state.RadiusInputValue || "5",
          red: this.state.RedInputValue || "255",
          width: this.state.WidthInputValue || "2"
        },
        success: data => {
          this.props.addVector(data.id, this.state.NameInputValue || "Без названия", this.state.RedInputValue || "255", this.state.GreenInputValue || "127", this.state.BlueInputValue || "0", this.state.AlphaInputValue / 100 || "0.2", this.state.WidthInputValue || "2", this.state.RadiusInputValue || "5");
          console.log(data);
        },
        error: data => {
          debugger;
          if (this.state.NameInputValue.length > 255) {
            alert("ОШИБКА ДОБАВЛЕНИЯ: Слишком длинное название (макс. 256 знаков)");
          }
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
          placeholder: '\u0411\u0435\u0437 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044F',
          style: { 'margin': '0 0 5px 10px' },
          onChange: NameInputValue => this.onNameInputChange(NameInputValue) }),
        _react2.default.createElement(
          'h4',
          { style: { 'fontFamily': 'arial', 'color': 'white', 'width': '75px', 'display': 'inline-block', 'margin': '0 0 0 10px' } },
          'RGBA:'
        ),
        _react2.default.createElement(
          'h4',
          { style: { 'backgroundColor': 'red', 'width': '10px', 'display': 'inline-block', 'margin': '0 0 5px 10px' } },
          '\xA0'
        ),
        _react2.default.createElement('input', {
          type: 'number',
          min: '0',
          max: '255',
          placeholder: '255',
          style: { 'margin': '0 0 5px 0', 'width': '40px' },
          onChange: RedInputValue => this.onRedInputChange(RedInputValue) }),
        _react2.default.createElement(
          'h4',
          { style: { 'backgroundColor': 'green', 'width': '10px', 'display': 'inline-block', 'margin': '0 0 5px 5px' } },
          '\xA0'
        ),
        _react2.default.createElement('input', {
          type: 'number',
          min: '0',
          max: '255',
          placeholder: '127',
          style: { 'margin': '0 0 5px 0', 'width': '40px' },
          onChange: GreenInputValue => this.onGreenInputChange(GreenInputValue) }),
        _react2.default.createElement(
          'h4',
          { style: { 'backgroundColor': 'blue', 'width': '10px', 'display': 'inline-block', 'margin': '0 0 5px 5px' } },
          '\xA0'
        ),
        _react2.default.createElement('input', {
          type: 'number',
          min: '0',
          max: '255',
          placeholder: '0',
          style: { 'margin': '0 0 5px 0', 'width': '40px' },
          onChange: BlueInputValue => this.onBlueInputChange(BlueInputValue) }),
        _react2.default.createElement(
          'h4',
          { style: { 'background': 'linear-gradient(grey 1px, white 0)', 'backgroundSize': '100% 2px', 'width': '10px', 'display': 'inline-block', 'margin': '0 0 5px 5px' } },
          '\xA0'
        ),
        _react2.default.createElement('input', {
          type: 'number',
          min: '0',
          max: '100',
          placeholder: '20',
          style: { 'margin': '0 0 5px 0', 'width': '40px' },
          onChange: AlphaInputValue => this.onAlphaInputChange(AlphaInputValue) }),
        _react2.default.createElement(
          'h4',
          { style: { 'fontFamily': 'arial', 'color': 'white', 'display': 'inline-block', 'margin': '0 0 0 2px' } },
          '%'
        ),
        _react2.default.createElement(
          'h4',
          { style: { 'fontFamily': 'arial', 'color': 'white', 'width': '124px', 'display': 'inline-block', 'margin': '0 0 0 10px' } },
          '\u0428\u0438\u0440\u0438\u043D\u0430 \u043B\u0438\u043D\u0438\u0438:'
        ),
        _react2.default.createElement('input', {
          type: 'number',
          min: '0',
          max: '10',
          placeholder: '2',
          style: { 'margin': '0 0 5px 5px', 'width': '30px' },
          onChange: WidthInputValue => this.onWidthInputChange(WidthInputValue) }),
        _react2.default.createElement(
          'h4',
          { style: { 'fontFamily': 'arial', 'color': 'white', 'width': '112px', 'display': 'inline-block', 'margin': '0 0 0 16px' } },
          '\u0420\u0430\u0434\u0438\u0443\u0441 \u0442\u043E\u0447\u043A\u0438:'
        ),
        _react2.default.createElement('input', {
          type: 'number',
          min: '0',
          max: '50',
          placeholder: '5',
          style: { 'margin': '0 0 5px 5px', 'width': '30px' },
          onChange: RadiusInputValue => this.onRadiusInputChange(RadiusInputValue) }),
        _react2.default.createElement(
          'button',
          {
            className: 'geometry-menu',
            style: { 'width': '200px', 'display': 'block' },
            onClick: this.onAddVector },
          '\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043D\u043E\u0432\u044B\u0439 \u0441\u043B\u043E\u0439'
        )
      );
    }
  }
  exports.default = AddVector;
});