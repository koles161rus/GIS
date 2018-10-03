define(['exports', 'react', 'openlayers', 'app/utils'], function (exports, _react, _openlayers, _utils) {
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

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  class MapToolbar extends _react2.default.Component {
    constructor(props) {
      super(props);

      (0, _utils.bind)(this, 'zoomIn', 'zoomOut', 'startingPoint', 'setProjection', 'prevExtent', 'nextExtent', 'goToExtentInHistory', 'saveExtentsToLocalStorage', 'loadExtentsFromLocalStorage', 'initExtentHistory');

      this.mapAnimationDuration = 200;

      var _loadExtentsFromLocal = this.loadExtentsFromLocalStorage();

      let extents = _loadExtentsFromLocal.extents,
          currentExtentIndex = _loadExtentsFromLocal.currentExtentIndex;

      if (extents) {
        this.suppressNextMoveEnd = true;
      }

      this.extents = extents || [];

      this.state = {
        activeToolName: null,
        currentExtentIndex: currentExtentIndex || 0
      };

      this.initExtentHistory();
    }

    zoomIn() {
      let mapView = this.props.map.getView();

      mapView.animate({
        zoom: mapView.getZoom() + 1,
        duration: this.mapAnimationDuration
      });
    }
    zoomOut() {
      let mapView = this.props.map.getView();

      mapView.animate({
        zoom: mapView.getZoom() - 1,
        duration: this.mapAnimationDuration
      });
    }

    startingPoint() {
      let ext = window.projectSettings && window.projectSettings.DEFAULT_MAP_EXTENT;
      if (ext) {
        ext = _openlayers2.default.proj.transformExtent(ext, 'EPSG:3857', this.props.map.getView().getProjection());
        this.props.map.getView().fit(ext, this.props.map.getSize(), { duration: this.mapAnimationDuration });
      } else {
        this.props.map.getView().animate({
          center: _openlayers2.default.proj.transform([4330710, 5972970], 'EPSG:3857', this.props.map.getView().getProjection()),
          zoom: 14,
          duration: this.mapAnimationDuration
        });
      }
    }

    setProjection() {
      let map = this.props.map;
      let oldProj = map.getView().getProjection().getCode();
      let newProj;
      if (map.getView().getProjection().getCode() === 'EPSG:3857') {
        newProj = 'EPSG:4326';
      } else {
        newProj = 'EPSG:3857';
      }

      map.getLayers().forEach(layer => {
        let extent = layer.getExtent();
        if (extent !== undefined) {
          let newExtent = _openlayers2.default.proj.transformExtent(layer.wgs84extent, oldProj, newProj);
          layer.setExtent(newExtent);
        }
        let source = layer.getSource();
        if (source instanceof _openlayers2.default.source.Vector) {
          source.forEachFeature(feature => {
            feature.getGeometry().transform(oldProj, newProj);
          });
        } else {
          source.refresh();
        }
      });

      this.extents.forEach((e, i) => {
        this.extents[i].center = _openlayers2.default.proj.transform(e.center, oldProj, newProj);
      });
      this.suppressNextMoveEnd = true;

      map.setView(new _openlayers2.default.View({
        projection: newProj,
        center: _openlayers2.default.proj.transform(map.getView().getCenter(), oldProj, newProj),
        zoom: map.getView().getZoom()
      }));
    }

    initExtentHistory() {
      this.extentHistoryMaxLength = 70;
      this.extentHistoryLengthTreshhold = 30;

      window.addEventListener('beforeunload', this.saveExtentsToLocalStorage);

      this.props.map.on('moveend', event => {
        if (this.suppressNextMoveEnd) {
          this.suppressNextMoveEnd = false;
        } else {
          if (this.state.currentExtentIndex < this.extents.length - 1) {
            this.extents = this.extents.slice(0, this.state.currentExtentIndex + 1);
          }

          let view = event.map.getView();

          this.extents.push({
            center: view.getCenter(),
            zoom: view.getZoom()
          });

          if (this.extents.length > this.extentHistoryMaxLength) {
            this.extents = this.extents.slice(this.extentHistoryLengthTreshhold, this.extents.length);
            this.saveExtentsToLocalStorage();
          }

          this.setState({ currentExtentIndex: this.extents.length - 1 });
        }
      });
    }

    loadExtentsFromLocalStorage() {
      let extents = (0, _utils.getFromLocalStorage)('extentHistory');
      let currentExtentIndex = (0, _utils.getFromLocalStorage)('extentHistoryExtentIndex');
      if (extents && currentExtentIndex !== undefined) {
        extents.forEach(extent => {
          extent.center = _openlayers2.default.proj.transform(extent.center, 'EPSG:3857', this.props.map.getView().getProjection());
        });

        return {
          extents: extents,
          currentExtentIndex: currentExtentIndex
        };
      }
      return {};
    }

    saveExtentsToLocalStorage() {
      let extents = this.extents.map(extent => ({
        zoom: extent.zoom,
        center: _openlayers2.default.proj.transform(extent.center, this.props.map.getView().getProjection(), 'EPSG:3857')
      }));

      (0, _utils.saveToLocalStorage)('extentHistory', extents);
      (0, _utils.saveToLocalStorage)('extentHistoryExtentIndex', this.state.currentExtentIndex);
    }

    goToExtentInHistory(index) {
      let view = this.props.map.getView();
      let extent = this.extents[index];
      this.suppressNextMoveEnd = true;
      view.animate(_extends({}, extent, {
        duration: this.mapAnimationDuration
      }));
      this.setState({ currentExtentIndex: index });
    }

    prevExtent() {
      let prevExtentIndex = this.state.currentExtentIndex - 1;
      if (prevExtentIndex >= 0) {
        this.goToExtentInHistory(prevExtentIndex);
      }
    }

    nextExtent() {
      let nextExtentIndex = this.state.currentExtentIndex + 1;
      if (nextExtentIndex <= this.extents.length - 1) {
        this.goToExtentInHistory(nextExtentIndex);
      }
    }

    render() {
      let map = this.props.map;

      return _react2.default.createElement(
        'div',
        { className: 'menu-buttons' },
        _react2.default.createElement('button', {
          className: 'zoom-in',
          onClick: this.zoomIn,
          title: '\u041F\u0440\u0438\u0431\u043B\u0438\u0437\u0438\u0442\u044C'
        }),
        _react2.default.createElement('button', {
          className: 'zoom-out',
          onClick: this.zoomOut,
          title: '\u041E\u0442\u0434\u0430\u043B\u0438\u0442\u044C'
        }),
        _react2.default.createElement('button', {
          className: 'starting-point',
          onClick: this.startingPoint,
          title: '\u0412\u0435\u0440\u043D\u0443\u0442\u044C\u0441\u044F \u0432 \u043D\u0430\u0447\u0430\u043B\u044C\u043D\u0443\u044E \u0442\u043E\u0447\u043A\u0443'
        }),
        _react2.default.createElement('button', {
          className: 'set-projection',
          onClick: this.setProjection,
          title: '\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u043F\u0440\u043E\u0435\u043A\u0446\u0438\u044E'
        }),
        _react2.default.createElement('button', {
          className: 'prev-extent',
          onClick: this.prevExtent,
          title: '\u0412\u0435\u0440\u043D\u0443\u0442\u044C\u0441\u044F \u043D\u0430\u0437\u0430\u0434'
        }),
        _react2.default.createElement('button', {
          className: 'next-extent',
          onClick: this.nextExtent,
          title: '\u0412\u0435\u0440\u043D\u0443\u0442\u044C\u0441\u044F \u0432\u043F\u0435\u0440\u0451\u0434'
        })
      );
    }
  }
  exports.default = MapToolbar;
});