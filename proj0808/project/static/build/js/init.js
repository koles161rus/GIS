define([], function () {
  'use strict';

  require.config({
    baseUrl: '/static',
    paths: {
      'react': 'node_modules/react/umd/react.development',
      'react-dom': 'node_modules/react-dom/umd/react-dom.development',
      'openlayers': 'node_modules/openlayers/dist/ol',
      'app': 'build/js',
      'jquery': 'node_modules/jquery/dist/jquery.min',
      'proj4': 'node_modules/proj4/dist/proj4'
    },
    waitSeconds: 20
  });

  require(['app/views/App'], () => {});
});