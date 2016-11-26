# chromecast-osx-audio

Streams macOS audio input to a local Chromecast device.

## Installation

To install the module for use in your projects:

```bash
npm install -g chromecast-osx-audio
```

## Usage

Global installation exposes the `chromecast` command to your shell. Running this
command will start listening to input, and connect to a local Chromecast with a
stream of that input.

To direct system audio, use [Soundflower](#soundflower).

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
   -l, --list        List devices available for streaming.
   -d, --device      Specify device to use for streaming.
   --version         print version and exit
```

### Soundflower

To direct system audio requires an additional piece of software. You see, macOS doesn’t provide native methods for accessing system audio (the output of the system mixer) so anything that’s not an input (like the microphone) is inaccessible. However, there’s a open source utility called [Soundflower][soundflower] that solves this for you. If you’re unfamiliar with it, here’s a step by step to get it working:

1. Install Soundflower. Reboot.
2. Install chromecast-osx-audio globally, with an `npm install -g chromecast-osx-audio`
3. Open your *System Preferences -> Sound* preference pane, and select “Soundflower (2ch)” as both your input and output.
4. Run `chromecast` in your terminal. It will find the first-available Chromecast, and stream your system audio to it.
5. Play your music/audio as normal. There is a 5–15 second delay due to how the Chromecast buffers.
6. Enjoy

## Environment Variables

None yet.

## Contributing

Feel free to send pull requests! I'm not picky, but would like the following:

1. Write tests for any new features, and do not break existing tests.
2. Be sure to point out any changes that break API.

## History

See [CHANGELOG](./CHANGELOG.md).

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

[soundflower]: http://rogueamoeba.com/freebies/soundflower/
