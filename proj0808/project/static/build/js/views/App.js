define(['react-dom', 'react', 'openlayers', 'app/utils', './Map', './Feature', './LayersList', './MapToolbar', './Draw', './TilesCollection', './AddTiles'], function (_reactDom, _react, _openlayers, _utils, _Map, _Feature, _LayersList, _MapToolbar, _Draw, _TilesCollection, _AddTiles) {
  'use strict';

  var _reactDom2 = _interopRequireDefault(_reactDom);

  var _react2 = _interopRequireDefault(_react);

  var _openlayers2 = _interopRequireDefault(_openlayers);

  var _Map2 = _interopRequireDefault(_Map);

  var _Feature2 = _interopRequireDefault(_Feature);

  var _LayersList2 = _interopRequireDefault(_LayersList);

  var _MapToolbar2 = _interopRequireDefault(_MapToolbar);

  var _Draw2 = _interopRequireDefault(_Draw);

  var _TilesCollection2 = _interopRequireDefault(_TilesCollection);

  var _AddTiles2 = _interopRequireDefault(_AddTiles);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  class App extends _react2.default.Component {
    constructor(props) {
      super(props);

      (0, _utils.bind)(this, 'setMap', 'setFeature');

      this.state = {
        map: undefined,
        feature: undefined
      };
    }
    setFeature(feature) {
      this.setState({ feature: feature });
    }
    setMap(map) {
      this.setState({ map: map });
    }
    render() {
      let setMap = this.setMap,
          setFeature = this.setFeature;
      var _state = this.state;
      let map = _state.map,
          feature = _state.feature;


      return _react2.default.createElement(
        'div',
        { className: 'app' },
        _react2.default.createElement(
          'div',
          { className: 'left-pane' },
          _react2.default.createElement(
            'h4',
            { className: 'headers' },
            '\u0420\u0435\u0434\u0430\u043A\u0442\u043E\u0440 \u0441\u043B\u043E\u0451\u0432'
          ),
          map && _react2.default.createElement(_TilesCollection2.default, { map: map }),
          map && _react2.default.createElement(_LayersList2.default, { map: map }),
          _react2.default.createElement(_Feature2.default, { feature: feature }),
          map && _react2.default.createElement(_Draw2.default, { map: map })
        ),
        _react2.default.createElement(
          'div',
          { className: 'right-pane' },
          _react2.default.createElement(_Map2.default, {
            setMap: setMap,
            setFeature: setFeature
          }),
          map && _react2.default.createElement(_MapToolbar2.default, { map: map })
        )
      );
    }
  }

  _reactDom2.default.render(_react2.default.createElement(App, null), document.getElementById('app-root'));

  // class App extends React.Component {
  //   constructor(props) {
  //     super(props);

  //     this.state = {
  //       language: 'Russian'
  //     };

  //     bind(this, 'onChildClick');
  //   }
  //   onChildClick(event) {
  //     this.setState({ language: event.target.innerText });
  //   }
  //   render() {
  //     return <div className='app'>
  //       <h1> {this.state.language} </h1>

  //       <Child language='Russian' onClick={this.onChildClick}/>
  //       <Child language='English' onClick={this.onChildClick}/>
  //       <Child language='Other' onClick={this.onChildClick}/>
  //     </div>;
  //   }
  // }

  // class Child extends React.Component {
  //   render() {
  //     return <div>
  //       <button onClick={this.props.onClick}>{this.props.language}</button>
  //     </div>;
  //   }
  // }


  // const GROCERIES = [
  //   { name: 'cucumbers', price: 30 },
  //   { name: 'milk', price: 60 },
  //   { name: 'toilet paper', price: 15 }
  // ];

  // export default class App extends React.Component {
  //   constructor(props) {
  //     super(props);
  //   }
  //   render() {
  //     // let groceriesElements = [];
  //     // for(let i = 0; i < GROCERIES.length; i++) {
  //     //   let item = GROCERIES[i];
  //     //   let element = <div>
  //     //     {item.name} - {item.price}
  //     //   </div>;
  //     //   groceriesElements.push(element);
  //     // }

  //     let groceriesElements = GROCERIES.map( function(item) {
  //       return <div>
  //         {item.name} : {item.price}
  //       </div>;
  //     })

  //     return <div>
  //       {groceriesElements}
  //     </div>;
  //   }
  // }
});