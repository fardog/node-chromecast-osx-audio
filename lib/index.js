var Webcast = require('webcast-osx-audio');
var Client = require('castv2-client').Client;
var DefaultMediaReceiver = require('castv2-client').DefaultMediaReceiver;
var mdns = require('mdns');

var Chromecast = function(options) {
  var deviceFound = false;
  var browser = mdns.createBrowser(mdns.tcp('googlecast'));
  if (options['l']) {
    console.log("Devices available for casting:");
  }
  browser.on('serviceUp', function(service) {

    if (typeof options['d'] !== 'undefined') {
      if (options['d'] == service.name) {
        // only start the service for the specified device.
        ondeviceup(service.name, service.addresses[0]);
      }
    }
    else {
      if (!options['l']) {
        console.log('found device "%s" at %s:%d', service.name, service.addresses[0], service.port);
      }
      // -d wasn't specified. Start for the first specified
      ondeviceup(service.name, service.addresses[0]);
    }
    browser.stop();
  });

  browser.start();

  function ondeviceup(name, host) {
    if (options['l']) {
      console.log(name);
      return;
    }
    // don't try and start more than one connection (will fail if multiple devices are found)
    if (deviceFound) {
      return;
    }
    deviceFound = true;

    console.log("Connecting to device '%s'", name);
    var client = new Client();

    client.connect(host, function() {
      console.log('connected, launching app ...');

      var webcast = new Webcast(options);

      client.launch(DefaultMediaReceiver, function(err, player) {
        if (err) {
          console.error('Error: %s', err.message);
          client.close();
          return;
        }
        var media = {

          contentId: 'http://' + webcast.ip + ':' + options.port + '/' + options.url,
          contentType: 'audio/mpeg3',
          streamType: 'LIVE', // or LIVE

          // Title and cover displayed while buffering
          metadata: {
            type: 0,
            metadataType: 0,
            title: options.name 
          }        
        };

        player.on('status', function(status) {
          console.log('status broadcast playerState=%s', status.playerState);
        });

        console.log('app "%s" launched, loading media %s ...', player.session.displayName, media.contentId);

        player.load(media, { autoplay: true }, function(err, status) {
          if (err) {
            console.error('Error: %s', err.message);
            client.close();
            return;
          }
          console.log('media loaded playerState=%s', status.playerState);
        });
      });

    });

    client.on('error', function(err) {
      console.error('Error: %s', err.message);
      client.close();
    });

  }
}

module.exports = Chromecast;
