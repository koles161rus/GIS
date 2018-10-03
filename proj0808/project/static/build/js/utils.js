define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.safeCall = safeCall;
  exports.getCookie = getCookie;
  exports.xhr = xhr;
  exports.bind = bind;
  exports.saveToLocalStorage = saveToLocalStorage;
  exports.getFromLocalStorage = getFromLocalStorage;
  function safeCall(func, ...args) {
    if (typeof func === 'function') {
      return func(...args);
    }
  }

  function getCookie(name) {
    let value = '; ' + document.cookie;
    let parts = value.split('; ' + name + '=');
    if (parts.length == 2) {
      return parts.pop().split(';').shift();
    }
  }

  function xhr(options = {}) {
    let url = options.url,
        method = options.method,
        data = options.data,
        done = options.done,
        fail = options.fail,
        always = options.always,
        contentType = options.contentType;


    let request = new XMLHttpRequest();
    request.open(method || 'GET', url);
    request.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
    request.contentType = contentType;

    request.onload = () => {
      if (request.status == 200) {
        safeCall(done, request.response, request);
      } else {
        safeCall(fail, request);
      }
      safeCall(always, request);
    };
    request.send(data);
    return request;
  }

  function bind(context, ...funcNames) {
    funcNames.forEach(funcName => {
      if (typeof context[funcName] === 'function') {
        context[funcName] = context[funcName].bind(context);
      }
    });
  }

  function saveToLocalStorage(fieldName, data) {
    let ls = window.localStorage;
    let mapData = {};
    if (ls.geois_rostov_map_data) {
      try {
        mapData = JSON.parse(ls.geois_rostov_map_data);
      } catch (e) {
        console.log('Ошибка парсинга данных карты из localStorage');
        return;
      }
      mapData[fieldName] = data;
      ls.geois_rostov_map_data = JSON.stringify(mapData);
    } else {
      mapData[fieldName] = data;
      ls.geois_rostov_map_data = JSON.stringify(mapData);
    }
  }

  function getFromLocalStorage(fieldName) {
    let ls = window.localStorage;
    if (ls.geois_rostov_map_data) {
      let mapData = {};
      try {
        mapData = JSON.parse(ls.geois_rostov_map_data);
      } catch (e) {
        console.log('Ошибка парсинга данных карты из localStorage');
        return;
      }
      return mapData[fieldName];
    }
  }
});