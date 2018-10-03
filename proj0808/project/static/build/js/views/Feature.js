define(['exports', 'react'], function (exports, _react) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  class Feature extends _react2.default.Component {
    render() {
      let feature = this.props.feature;
      let message = '';
      let prop;
      if (feature === undefined) {
        message = 'Object is not selected';
      } else {
        let featProps = feature.getProperties();
        for (let key in featProps) {
          if (key !== 'geometry') {
            message += feature.get(key);
          }
        }

        let entries = Object.entries(featProps);
        prop = entries.map(function (property) {
          if (property[0] !== 'geometry') {
            return _react2.default.createElement(
              'div',
              { className: 'features' },
              property[0],
              ': ',
              property[1]
            );
          }
        });
      }

      return _react2.default.createElement(
        'div',
        { className: 'feature' },
        _react2.default.createElement(
          'h4',
          { className: 'headers' },
          '\u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u043E \u0432\u044B\u0434\u0435\u043B\u0435\u043D\u043D\u043E\u043C \u043E\u0431\u044A\u0435\u043A\u0442\u0435'
        ),
        prop
      );
    }
  }
  exports.default = Feature;
});