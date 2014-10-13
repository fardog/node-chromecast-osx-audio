var Webcast = require('webcast-osx-audio');
var Client = require('castv2-client').Client;
var DefaultMediaReceiver = require('castv2-client').DefaultMediaReceiver;
var mdns = require('mdns');

var Chromecast = function(options) {
  var browser = mdns.createBrowser(mdns.tcp('googlecast'));

  browser.on('serviceUp', function(service) {
    console.log('found device "%s" at %s:%d', service.name, service.addresses[0], service.port);
    ondeviceup(service.addresses[0]);
    browser.stop();
  });

  browser.start();

  function ondeviceup(host) {

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
