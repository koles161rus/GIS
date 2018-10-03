import React from 'react';

export default class Feature extends React.Component {
  render() {
    let feature = this.props.feature;
    let message = '';
    let prop;
    if (feature === undefined) {
      message = 'Object is not selected';
    }
    else {
      let featProps = feature.getProperties();
      for (let key in featProps) {
        if( key !== 'geometry' ) {
          message += feature.get(key);
        }
      }

      let entries = Object.entries( featProps );
      prop = entries.map( function(property) {
        if( property[0] !== 'geometry' ) {
          return <div className="features">
            {property[0]}: {property[1]}
          </div>;
        }
      });
    }


		return <div className="feature">
      <h4 className="headers">Информация о выделенном объекте</h4>
      {prop}
    </div>;
	}
}