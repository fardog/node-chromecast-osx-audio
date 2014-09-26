# chromecast-osx-audio v0.1.2

Streams Mac OS X audio input to a local Chromecast device.

## Installation

To install the module for use in your projects:

```bash
npm install -g chromecast-osx-audio
```

## Usage

Global installation exposes the `chromecast` command to your shell. Running this command will start listening to input, and connect to a local Chromecast with a stream of that input.

To direct system audio, use [Soundflower](http://rogueamoeba.com/freebies/soundflower/).

```bash
$ chromecast --help

Usage: chromecast [options]

Options:
   -p, --port        The port that the streaming server will listen on.  [3000]
   -b, --bitrate     The bitrate for the mp3 encoded stream.  [192]
   -m, --mono        The stream defaults to stereo. Set to mono with this flag.
   -s, --samplerate  The sample rate for the mp3 encoded stream  [44100]
   -n, --name        A name for the server to report itself as.  [Chrome OSX Audio Stream]
   -u, --url         The relative URL that the stream will be hosted at.  [stream.mp3]
   -i, --iface       The public interface that should be reported. Selects the first interface by default.
   --version         print version and exit
```

## Environment Variables

None yet.

## Known Issues

- Only the first Chromecast found will be streamed to. Future versions will allow you to pick a Chromecast.

## Contributing

Feel free to send pull requests! I'm not picky, but would like the following:

1. Write tests for any new features, and do not break existing tests.
2. Be sure to point out any changes that break API.

## History

- **v0.1.2**  
Updates webcast-osx-audio dependency.

- **v0.1.1**  
Updates webcast-osx-audio dependency.

- **v0.1.0**  
Splits webcast functionality to the [webcast-osx-audio](https://github.com/fardog/node-webcast-osx-audio) package.

- **v0.0.3**  
Updates to latest version of osx-audio.

- **v0.0.2**  
Readme was all wrong. Republished.

- **v0.0.1**  
Initial Release.

## The MIT License (MIT)

Copyright (c) 2014 Nathan Wittstock

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
