var Webcast = require('webcast-osx-audio');
var Client = require('castv2-client').Client;
var DefaultMediaReceiver = require('castv2-client').DefaultMediaReceiver;
var chromecast = require('./chromecast');

var Chromecast = function(options) {
  var deviceFound = false;
  
  if (options['l']) {
    console.log("Devices available for casting:");
  }

  chromecast.search(function (err, devices) {
    if (err) {

      return;
    }

    if (devices) {
      if (options['j']){
        console.log(JSON.stringify(devices));
        return;
      }


      for (var name in devices) {
        var device = devices[name];
        if (typeof options['d'] !== 'undefined') {
          if (options['d'] == device.name) {
            // only start the service for the specified device.
            ondeviceup(device.name, device.addresses[0]);
          }
        }
        else {
          if (!options['l']) {
            console.log('found device "%s" at %s:%d', device.name, device.addresses[0], device.port);
          }
          // -d wasn't specified. Start for the first specified
          ondeviceup(device.name, device.addresses[0]);
        }
      }
    }

  });


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
