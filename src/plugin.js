"use strict";
import "@hola.org/videojs-utils";

import videojs from "video.js";
import { version as VERSION } from "../package.json";

const Plugin = videojs.getPlugin("plugin");

// Default options for the plugin.
const defaults = {
  info: true,
  report: false,
  popout: false,
  quality: true,
  debugging: true,
  about: true,
  before: "fullscreenToggle",
  poweredBy: "GuacPlayer",
  onReport: () => {},
  onPopout: () => {},
};

const ClickableComponent = videojs.getComponent("ClickableComponent");
const MenuItem = videojs.getComponent("MenuItem");

MenuItem.prototype.createEl = function (type, props, attrs) {
  props = Object.assign(
    {
      className: "vjs-menu-item",
      innerHTML:
        '<span class="vjs-menu-item-label" data-i18n="' +
        this.options_.label +
        '">' +
        this.options_.label +
        "</span>",
      tabIndex: -1,
    },
    props
  );
  return ClickableComponent.prototype.createEl.call(this, "li", props, attrs);
};

import "./Overlay";
import "./InfoOverlay";
import "./PopupMenu";
import "./SettingsButton";

/**
 * An advanced Video.js plugin. For more information on the API
 *
 * See: https://blog.videojs.com/feature-spotlight-advanced-plugins/
 */
class Settings extends Plugin {
  /**
   * Create a Settings plugin instance.
   *
   * @param  {Player} player
   *         A Video.js Player instance.
   *
   * @param  {Object} [options]
   *         An optional options object.
   *
   *         While not a core part of the Video.js plugin architecture, a
   *         second argument of options is a convenient way to accept inputs
   *         from your plugin's caller.
   */
  constructor(player, options) {
    // the parent class will add player under this.player
    super(player);

    function showInfoOverlay() {
      if (!player) {
        return;
      }
      const overlay = player.getChild("InfoOverlay");

      if (typeof overlay !== "undefined") {
        overlay.toggle();
      }
    }

    this.options = videojs.mergeOptions(defaults, options);

    this.player.ready(() => {
      this.player.addClass("vjs-settings");

      if (
        !player.options().controls ||
        !player.options().controls.settingsButton == false
      ) {
        return;
      }

      // prevents duplicates
      if (player.isSettingsButtonInitialized === true) {
        return;
      }
      player.isSettingsButtonInitialized = true;

      // Inserts the settings menu button in control bar
      const controlBar = player.controlBar;

      if (controlBar) {
        player.controlBar.settingsButton = controlBar.addChild(
          "SettingsButton",
          this.options
        );
        const before = controlBar.getChild(options.before);

        if (before) {
          controlBar
            .el()
            .insertBefore(player.controlBar.settingsButton.el(), before.el());
        } else {
          controlBar.el().append(player.controlBar.settingsButton.el());
        }
      }

      if (this.options.info) {
        this.player.addChild("InfoOverlay");
      }
      this.player.addChild("PopupMenu", this.options);

      if (this.options.report) {
        this.player.on("guac-report", this.options.onReport.bind(this));
      }
      if (this.options.popout) {
        this.player.on("guac-popout", this.options.onPopout.bind(this));
      }
      this.player.on("guac-info-overlay", showInfoOverlay.bind(this));
    });
  }
}

// Define default values for the plugin's `state` object here.
Settings.defaultState = {};

// Include the version number.
Settings.VERSION = VERSION;

// Register the plugin with video.js.
videojs.registerPlugin("settings", Settings);

export default Settings;
