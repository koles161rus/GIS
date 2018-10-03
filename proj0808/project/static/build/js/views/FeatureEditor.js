define(['exports', 'react', 'openlayers', 'app/utils', './feature', 'jquery'], function (exports, _react, _openlayers, _utils, _feature, _jquery) {
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

  class FeatureEditor extends _react2.default.Component {
    constructor(props) {
      super(props);

      (0, _utils.bind)(this, 'onRemoveFeature', 'onDeleteFeature', 'onAddFeature', 'onSaveFeatures', 'onGetFeatures');

      this.state = {
        NameInputValue: undefined,
        DescriptInputValue: undefined,
        id: undefined
      };
    }

    onRemoveFeature() {
      let vectorSource = this.props.vector.getSource();
      let layerList = this.props.map.getLayers().getArray();
      let indexOfVectorLayer = layerList.findIndex(item => item.get('name') === 'Объекты');
      let vectorLayerSource = layerList[indexOfVectorLayer].getSource();
      let selectedFeatures = this.props.selectInteraction.getFeatures();
      selectedFeatures.forEach(function (selectedFeature) {
        selectedFeatures.remove(selectedFeature);
        let vectorFeatures = vectorSource.getFeatures();
        vectorFeatures.forEach(function (sourceFeature) {
          if (sourceFeature === selectedFeature) {
            vectorSource.removeFeature(sourceFeature);
          }
        });
        let vectorLayerFeatures = vectorLayerSource.getFeatures();
        vectorLayerFeatures.forEach(function (sourceLayerFeature) {
          if (sourceLayerFeature === selectedFeature) {
            vectorLayerSource.removeFeature(sourceLayerFeature);
          }
        });
      });
    }

    onAddFeature() {
      let features = this.props.vector.getSource().getFeatures();
      let dataFeatures = new _openlayers2.default.format.GeoJSON().writeFeatures(features);
      let parseFeatures = JSON.parse(dataFeatures);
      let selectedFeatures = this.props.selectInteraction.getFeatures();
      selectedFeatures.forEach(selectedFeature => {
        features.forEach((layer, i) => {
          if (features[i] === selectedFeature) {
            _jquery2.default.ajax({
              url: '/layers/add/',
              method: 'POST',
              data: {
                name: this.state.NameInputValue || "отсутствует",
                geomType: parseFeatures.features[i].geometry.type,
                coord: JSON.stringify(parseFeatures.features[i].geometry.coordinates),
                prop: this.state.DescriptInputValue || "отсутствует"
              },
              success: data => {
                console.log(data);
              },
              error: function (data) {
                (0, _jquery2.default)('body').html(data.responseText);
              }
            });
          }
        });
      });
    }

    onSaveFeatures() {
      let features = this.props.vector.getSource().getFeatures();
      let dataFeatures = new _openlayers2.default.format.GeoJSON().writeFeatures(features);
      let parseFeatures = JSON.parse(dataFeatures);
      features.forEach((layer, i) => {
        _jquery2.default.ajax({
          url: '/layers/add/',
          method: 'POST',
          data: {
            name: this.state.NameInputValue || "пусто",
            geomType: parseFeatures.features[i].geometry.type,
            coord: JSON.stringify(parseFeatures.features[i].geometry.coordinates),
            prop: this.state.DescriptInputValue || "пусто"
          },
          success: data => {
            this.setState({ id: data.id });
            console.log(data);
          },
          error: function (data) {
            (0, _jquery2.default)('body').html(data.responseText);
          }
        });
      });
    }

    onGetFeatures() {
      _jquery2.default.ajax({ url: '/layers/get/' }).done(res => {
        const featureList = new Array();
        const type = new Array();
        res.forEach(function (layer, i) {
          type[i] = res[i].geomType;
          if (type[i] === "Polygon") {
            featureList[i] = new _openlayers2.default.Feature({
              id: res[i].id,
              Название: res[i].name,
              Описание: res[i].prop,
              geometry: new _openlayers2.default.geom.Polygon(JSON.parse(res[i].coord))
            });
          } else if (type[i] === "Point") {
            featureList[i] = new _openlayers2.default.Feature({
              id: res[i].id,
              Название: res[i].name,
              Описание: res[i].prop,
              geometry: new _openlayers2.default.geom.Point(JSON.parse(res[i].coord))
            });
          } else if (type[i] === "LineString") {
            featureList[i] = new _openlayers2.default.Feature({
              id: res[i].id,
              Название: res[i].name,
              Описание: res[i].prop,
              geometry: new _openlayers2.default.geom.LineString(JSON.parse(res[i].coord))
            });
          }
        });
        this.props.vector.getSource().addFeatures(featureList);
      }).fail(request => {
        alert("Слоёв нет");
      });
    }

    onDeleteFeature() {
      let vectorSource = this.props.vector.getSource();
      let layerList = this.props.map.getLayers().getArray();
      let indexOfVectorLayer = layerList.findIndex(item => item.get('name') === 'Объекты');
      let vectorLayerSource = layerList[indexOfVectorLayer].getSource();
      let selectedFeatures = this.props.selectInteraction.getFeatures();
      let number;
      if (number === undefined || this.state.id !== undefined) {
        selectedFeatures.forEach(function (selectedFeature) {
          selectedFeatures.remove(selectedFeature);
          let vectorFeatures = vectorSource.getFeatures();
          vectorFeatures.forEach(function (sourceFeature) {
            if (sourceFeature === selectedFeature) {
              vectorSource.removeFeature(sourceFeature);
            }
          });
          let vectorLayerFeatures = vectorLayerSource.getFeatures();
          vectorLayerFeatures.forEach(function (sourceLayerFeature) {
            if (sourceLayerFeature === selectedFeature) {
              vectorLayerSource.removeFeature(sourceLayerFeature);
            }
          });
          vectorFeatures.forEach(vectorFeature => {
            if (vectorFeature === selectedFeature) {
              number = vectorFeature.get('id');
            }
          });
        });
        _jquery2.default.ajax({
          url: number !== undefined ? '/layers/remove/' + number : '/layers/remove/' + this.state.id,
          type: 'DELETE',
          success: data => {
            this.setState({ id: undefined });
            console.log(data);
          },
          error: function (data) {
            //$('body').html(data.responseText);
            alert("ОШИБКА УДАЛЕНИЯ: Объект отсутствует в базе данных, либо изменён");
          }
        });
      }
    }

    onNameInputChange(event) {
      this.setState({ NameInputValue: event.target.value });
    }

    onDescriptInputChange(event) {
      this.setState({ DescriptInputValue: event.target.value });
    }

    render() {
      return _react2.default.createElement(
        'div',
        { className: 'feature-buttons' },
        _react2.default.createElement(
          'form',
          { className: 'form-inline' },
          _react2.default.createElement(
            'label',
            null,
            '\u0422\u0438\u043F \u0433\u0435\u043E\u043C\u0435\u0442\u0440\u0438\u0438 \xA0'
          ),
          _react2.default.createElement(
            'select',
            { id: 'type', className: 'geometry-menu', onChange: this.props.onSelectChange },
            _react2.default.createElement(
              'option',
              { value: 'select' },
              '\u041D\u0435 \u0432\u044B\u0431\u0440\u0430\u043D'
            ),
            _react2.default.createElement(
              'option',
              { value: 'point' },
              '\u0422\u043E\u0447\u043A\u0430'
            ),
            _react2.default.createElement(
              'option',
              { value: 'line' },
              '\u041B\u0438\u043D\u0438\u044F'
            ),
            _react2.default.createElement(
              'option',
              { value: 'poly' },
              '\u041F\u043E\u043B\u0438\u0433\u043E\u043D'
            ),
            _react2.default.createElement(
              'option',
              { value: 'circle' },
              '\u041A\u0440\u0443\u0433'
            ),
            _react2.default.createElement(
              'option',
              { value: 'rectangle' },
              '\u041F\u0440\u044F\u043C\u043E\u0443\u0433\u043E\u043B\u044C\u043D\u0438\u043A'
            )
          )
        ),
        _react2.default.createElement(
          'h4',
          { style: { 'fontFamily': 'arial', 'color': 'white', 'width': '75px', 'display': 'inline-block', 'margin': '0 0 0 0' } },
          '\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435:'
        ),
        _react2.default.createElement('input', {
          type: 'text',
          size: '28',
          style: { 'margin': '5px 0 0 10px' },
          onChange: NameInputValue => this.onNameInputChange(NameInputValue) }),
        _react2.default.createElement(
          'h4',
          { style: { 'fontFamily': 'arial', 'color': 'white', 'width': '75px', 'display': 'inline-block', 'margin': '0 0 0 0' } },
          '\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435:'
        ),
        _react2.default.createElement('input', {
          type: 'text',
          size: '28',
          style: { 'margin': '5px 0 0 10px' },
          onChange: DescriptInputValue => this.onDescriptInputChange(DescriptInputValue) }),
        _react2.default.createElement('button', { className: 'cross-button',
          onClick: this.onRemoveFeature,
          title: '\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0432\u044B\u0434\u0435\u043B\u0435\u043D\u043D\u044B\u0439 \u043E\u0431\u044A\u0435\u043A\u0442 \u0441 \u043A\u0430\u0440\u0442\u044B' }),
        _react2.default.createElement('button', { className: 'remove-button',
          onClick: this.onDeleteFeature,
          title: '\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0432\u044B\u0434\u0435\u043B\u0435\u043D\u043D\u044B\u0439 \u043E\u0431\u044A\u0435\u043A\u0442 \u0438\u0437 \u0431\u0430\u0437\u044B \u0434\u0430\u043D\u043D\u044B\u0445' }),
        _react2.default.createElement('button', { className: 'text-button',
          onClick: this.onAddFeature,
          title: '\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0432\u044B\u0434\u0435\u043B\u0435\u043D\u043D\u044B\u0439 \u043E\u0431\u044A\u0435\u043A\u0442' }),
        _react2.default.createElement('button', { className: 'upload-button',
          onClick: this.onSaveFeatures,
          title: '\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0435 \u043E\u0431\u044A\u0435\u043A\u0442\u044B' }),
        _react2.default.createElement('button', { className: 'download-button',
          onClick: this.onGetFeatures,
          title: '\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u044B\u0435 \u043E\u0431\u044A\u0435\u043A\u0442\u044B' })
      );
    }
  }
  exports.default = FeatureEditor;
});