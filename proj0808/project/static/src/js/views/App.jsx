import ReactDom from 'react-dom';
import React from 'react';
import ol from 'openlayers';
import { bind } from 'app/utils';
import Map from './Map';
import Feature from './Feature';
import LayersList from './LayersList';
import MapToolbar from './MapToolbar';
import Draw from './Draw';
import TilesCollection from './TilesCollection';
import AddTiles from './AddTiles';

class App extends React.Component {
  constructor(props) {
    super(props);

    bind( this, 'setMap', 'setFeature' );

    this.state = {
      map: undefined,
      feature: undefined
    };
  }
  setFeature( feature ) {
    this.setState({ feature: feature });
  }
  setMap( map ) {
    this.setState({ map: map });
  }
  render() {
    let {
      setMap,
      setFeature,
      state: {
        map,
        feature,
      }
    } = this;

    return <div className='app'>
      <div className='left-pane'>
        <h4 className="headers">Редактор слоёв</h4>
          {
            map &&
            <TilesCollection map={map}/>
          }
          {
            map &&
            <LayersList map={map}/>
          }
        <Feature feature={feature}/>
        {
          map &&
          <Draw map={map}/>
        }
      </div>
      <div className='right-pane'>
        <Map
          setMap={setMap}
          setFeature={setFeature}
        />
        {
          map &&
          <MapToolbar map={map}/>
        }
      </div>
    </div>;
  }
}

ReactDom.render( <App/>, document.getElementById( 'app-root' ) );


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