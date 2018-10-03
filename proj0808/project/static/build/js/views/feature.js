define(["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  const geojson = exports.geojson = {
    "type": "FeatureCollection",
    "features": [{
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[4326373, 5970329], [4326645, 5970868], [4327462, 5972856], [4328155, 5973750], [4328002, 5973898], [4328847, 5974385], [4329448, 5974537], [4333308, 5974643], [4334598, 5974528], [4335580, 5974350], [4326373, 5970329]], [[4326473, 5970429], [4326745, 5970968], [4327562, 5972756], [4328255, 5973750], [4328202, 5973798], [4328947, 5974285], [4329448, 5974437], [4333308, 5974443], [4334598, 5974328], [4335280, 5974250], [4326473, 5970429]]]
      },
      "properties": {
        "title": "Poly",
        "number": 5
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "MultiPoint",
        "coordinates": [[4330710, 5972970], [4331626, 5977079]]
      },
      "properties": {
        "name": "Points",
        "value": 1
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [[4330710, 5972970], [4331626, 5977079]]
      },
      "properties": {
        "description": "Lines",
        "power": "3"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "MultiLineString",
        "coordinates": [[[4330528, 5976477], [4330432, 5975541]], [[4330041, 5975742], [4330948, 5976267]]]
      },
      "properties": {
        "name": "Lines",
        "power": 10
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [[[[4332171, 5976974], [4332754, 5976716], [4332601, 5976429], [4332047, 5976697], [4332171, 5976974]], [[4328062, 5977165], [4326209, 5974958], [4328148, 5974413], [4329171, 5975171], [4328062, 5977165]]]]
      },
      "properties": {
        "description": "Polys",
        "number": 15
      }
    }]
  };
});