import videojs from 'video.js';

const Component = videojs.getComponent('Component');
const Overlay = videojs.getComponent('Overlay');

function round(val) {
  if (typeof val !== 'number') {
    return val;
  }
  return val.toFixed(3);
}

class InfoOverlay extends Overlay {
  constructor(player, options) {
    this.updateInterval = null;
    this.info_data = {
      videoResolution: {
        units: '',
        title: player.localize('Video Resolution'),
        get(p) {
          return `${p.videoWidth()}x${p.videoHeight()}`;
        }
      },
      displayResolution: {
        units: '',
        title: player.localize('Display Resolution'),
        get(p) {
          return `${p.currentWidth()}x${p.currentHeight()}`;
        }
      },
      droppedFrames: {
        units: '',
        title: player.localize('Dropped frames'),
        get(p) {
          const videoPlaybackQuality = p.getVideoPlaybackQuality();

          if (videoPlaybackQuality) {
            return `${videoPlaybackQuality.droppedVideoFrames}/${videoPlaybackQuality.totalVideoFrames}`;
          }
          return '--';

        }
      },
      duration: {
        units: 'sec',
        title: player.localize('Duration'),
        get(p) {
          return round(p.duration());
        }
      },
      position: {
        units: 'sec',
        title: player.localize('Position'),
        get(p) {
          return round(p.currentTime());
        }
      },
      buffered: {
        units: 'sec',
        title: player.localize('Current buffer'),
        get(p) {
          const range = p.buffered();
          const pos = p.currentTime();

          if (range && range.length) {
            for (let i = 0; i < range.length; i++) {
              if (range.start(i) <= pos && range.end(i) >= pos) {
                return round(range.end(i) - pos);
              }
            }
          }
          return '--';
        }
      },
      downloaded: {
        units: 'sec',
        title: player.localize('Downloaded'),
        get(p) {
          const range = p.buffered();
          let buf_sec = 0;

          if (range && range.length) {
            for (let i = 0; i < range.length; i++) {
              buf_sec += range.end(i) - range.start(i);
            }
          }
          return round(buf_sec);
        }
      },
      vjs_version: {
        units: '',
        title: player.localize('VideoJS Version'),
        get() {
          return window.videojs.VERSION;
        }
      },
      stream_uri: {
        units: '',
        title: player.localize('Stream URI'),
        get(p) {
          return p.cache_.src;
        }
      }
    };
    Overlay.call(this, player, options);
  }
  createContent(container) {
    const _this = this;
    const player = this.player_;

    function create_el(el, opt) {
      opt = opt ? videojs.mergeOptions(opt) : opt;
      const proto_component = Component.prototype;

      return proto_component.createEl.call(_this, el, opt);
    }
    const title = create_el('div', {
      className: 'vjs-info-overlay-title',
      innerHTML: player.localize('Video Stats')
    });
    const close_btn = create_el('div', { className: 'vjs-info-overlay-x' });
    const close = this.toggle.bind(this, null, true);

    close_btn.addEventListener('click', close);
    close_btn.addEventListener('touchend', close);
    const content = create_el('div', {
      className: 'vjs-info-overlay-content'
    });
    const list = create_el('ul', { className: 'vjs-info-overlay-list' });
    let item;
    let title_text;

    for (const i in this.info_data) {
      item = create_el('li', { className: 'vjs-info-overlay-list-item' });
      title_text = player.localize(this.info_data[i].title);
      if (this.info_data[i].units) {
        title_text += ' [' + player.localize(this.info_data[i].units) + ']';
      }
      title_text += ': ';
      item.appendChild(create_el('strong', {
        innerHTML: title_text
      }));
      this.info_data[i].el = create_el('span');
      item.appendChild(this.info_data[i].el);
      list.appendChild(item);
    }
    content.appendChild(list);
    container.appendChild(title);
    container.appendChild(close_btn);
    container.appendChild(content);
    this.update();
    player.on('timeupdate', this.update.bind(this));
    // force updates when player is paused
    this.updateInterval = setInterval(this.update.bind(this), 2000);
  }
  update() {
    const player = this.player_;
    const info = this.info_data;

    for (const i in info) {
      info[i].el.innerHTML = info[i].get(player);
    }
  }
  toggle(caller, hide) {
    if (caller) {
      this.last_caller = caller;
    }
    if (this.visible || hide) {
      this.visible = false;
      if (this.last_caller) {
        this.last_caller.selected(false);
      }
      this.addClass('vjs-hidden');
      return;
    }
    this.update();
    this.visible = true;
    this.removeClass('vjs-hidden');
  }
  dispose() {
    if (this.updateInterval !== null) {
      clearInterval(this.updateInterval);
    }
    this.player_.off('timeupdate');
  }
}
videojs.registerComponent('InfoOverlay', InfoOverlay);
export default InfoOverlay;
