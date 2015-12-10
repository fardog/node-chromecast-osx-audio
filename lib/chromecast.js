var mdns = require('mdns');

var devices = {};
var browser = mdns.createBrowser(mdns.tcp('googlecast'));

var chromecast = {
  start: function(){
    browser.start();
  },

  stop: function () {
    browser.stop();
  },

  stream: function (cb) {
    browser.on('serviceUp', function (service) {
      devices[service.name] = service;
      cb && cb(null, services);
    });

    browser.on('serviceDown', function (service){
      delete devices[service.name];
      cb && cb(null, services);
    });

    this.start();
  },
  search: function (cb) {
    var numDevices = 0;
    this.stream();
    var interval = setInterval(function () {
      if (numDevices === Object.keys(devices).length) {
        clearInterval(interval);
        chromecast.stop();
        cb(null, devices);
      }
      numDevices = Object.keys(devices).length;
    }, 20);
  }
};

module.exports = chromecast;
