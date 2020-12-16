# videojs-settings

A settings plugin for the guac.live video.js player. Shows a menu with optional 3 items:

1. Video Stats – shows overlay with video stats
2. Quality select – if possible, user can select different quality for current video
3. Popout - Calls onPopout in options
4. Report - Calls onReport in options


## Requirements
We require the [@silvermine/videojs-quality-selector](https://github.com/silvermine/videojs-quality-selector/) plugin for quality options.

## Installation

```sh
npm install --save @guaclive/videojs-settings
```

## Usage

To include videojs-settings on your website or web application, use any of the following methods.

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-settings.min.js"></script>
<script>
  var player = videojs('my-video');

  var settingsOptions = {
    version: '1.0',
    popout: true,
    onPopout: () => {window.open('https://guac.live/embed/datagutt' , '_blank');},
    report: true,
    onReport: () => {window.open('https://guac.live/report/datagutt' , '_blank');}
  };
  player.settings(settingsOptions);
</script>
```

### Browserify/CommonJS

When using with Browserify, install videojs-settings via npm and `require` the plugin as you would any other module.

```js
var videojs = require('video.js');

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
require('@guaclive/videojs-settings');

var player = videojs('my-video');

var settingsOptions = {
  version: '1.0',
  popout: true,
  onPopout: () => {window.open('https://guac.live/embed/datagutt' , '_blank');},
  report: true,
  onReport: () => {window.open('https://guac.live/report/datagutt' , '_blank');}
};
player.settings(settingsOptions);
```

### RequireJS/AMD

When using with RequireJS (or another AMD library), get the script in whatever way you prefer and `require` the plugin as you normally would:

```js
require(['video.js', '@guaclive/videojs-settings'], function(videojs) {
  var player = videojs('my-video');

  var settingsOptions = {
    version: '1.0',
    popout: true,
    onPopout: () => {window.open('https://guac.live/embed/datagutt' , '_blank');},
    report: true,
    onReport: () => {window.open('https://guac.live/report/datagutt' , '_blank');}
  };
  player.settings(settingsOptions);
});
```
## License

MIT. Copyright (c) Thomas Lekanger &lt;datagutt@lekanger.no&gt;


[videojs]: http://videojs.com/
