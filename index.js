var Chromecast = function(options) {

  var lame = require('lame');
  var audio = require('osx-audio');
  var fs = require('fs');

  // we need to get the address of the local interface
  var ip = null;
  var interfaces = require('os').networkInterfaces();
  for (dev in interfaces) {
    interfaces[dev].forEach(function(a) {
      if (a.family === 'IPv4' && a.internal === false) {
        ip = a.address;
      }
    });
  }

  // create the Encoder instance
  var encoder = new lame.Encoder({
    // input
    channels: 2,        // 2 channels (left and right)
    bitDepth: 16,       // 16-bit samples
    sampleRate: 44100,  // 44,100 Hz sample rate

    // output
    bitRate: options.bitrate,
    outSampleRate: options.samplerate,
    mode: (options.mono ? lame.MONO : lame.STEREO) // STEREO (default), JOINTSTEREO, DUALCHANNEL or MONO
  });

  var input = new audio.Input();
  input.pipe(encoder);

  // set up an express app
  var express = require('express')
  var app = express()

  app.get('/', function(req, res) {
    res.send('Nope.');
  });

  app.get('/stream.mp3', function (req, res) {
    res.set({
      'Content-Type': 'audio/mpeg3',
      'Transfer-Encoding': 'chunked'
    });
    encoder.pipe(res);
  });

  var server = app.listen(options.port);


  var Client = require('castv2-client').Client;
  var DefaultMediaReceiver = require('castv2-client').DefaultMediaReceiver;
  var mdns = require('mdns');

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

      client.launch(DefaultMediaReceiver, function(err, player) {
        var media = {

          // Here you can plug an URL to any mp4, webm, mp3 or jpg file with the proper contentType.
          contentId: 'http://' + ip + ':' + server.address().port + '/stream.mp3',
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
          console.log('media loaded playerState=%s', status.playerState);
        });
      });

    });

    client.on('error', function(err) {
      console.log('Error: %s', err.message);
      client.close();
    });

  }
}

module.exports = Chromecast;
