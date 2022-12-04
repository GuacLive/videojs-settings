import videojs from 'video.js';

const MenuButton = videojs.getComponent('MenuButton');
const Component = videojs.getComponent('Component');

import SettingsMenu from './SettingsMenu';

export class SettingsButton extends MenuButton {
  constructor(player, options) {
    super(player, options);
    this.controlText_ = player.localize('Settings');
  }
  update() {
    const player = this.player_;
    const menu = new SettingsMenu(player, this.options_, this);

    if (this.menu) {
      player.removeChild(this.menu);
    }
    this.menu = menu;
    player.addChild(menu);
    this.buttonPressed_ = false;
    this.el_.setAttribute('aria-expanded', 'false');
    if (this.items && !this.items.length) {
      this.hide();
    } else if (this.items && this.items.length > 1) {
      this.show();
    }
  }
  buildCSSClass() {
    // vjs-icon-cog can be removed when the settings menu is integrated in video.js
    return `vjs-settings-button vjs-icon-cog ${super.buildCSSClass()}`;
  }
  handleClick() {
    if (this.buttonPressed_) {
      this.unpressButton();
    } else {
      this.pressButton();
    }
  }
  updateState() {
    this.player_.toggleClass('vjs-settings-expanded', this.buttonPressed_);
    this.el_.setAttribute('aria-expanded', this.buttonPressed_);
    this.menu.show(this.buttonPressed_);
  }
  unpressButton() {
    if (!this.enabled_) {
      return;
    }
    this.buttonPressed_ = false;
    this.updateState();
    this.el_.focus();
    this.clearInterval(this.activityInterval);
    if (this.clickListener) {
      videojs.off(document, ['tap', 'click'], this.clickListener);
      this.player_.off(['tap', 'click'], this.clickListener);
      this.clickListener = null;
    }
  }
  pressButton() {
    if (!this.enabled_) {
      return;
    }
    this.buttonPressed_ = true;
    this.updateState();
    this.menu.focus();
    // prevent setting vjs-user-inactive when menu is opened
    this.activityInterval = this.setInterval(this.player_.reportUserActivity.bind(this.player_), 250);
    const _this = this;

    this.setTimeout(function() {
      _this.clickListener = _this.unpressButton.bind(_this);
      videojs.on(document, ['tap', 'click'], this.clickListener);
      _this.player_.on(['tap', 'click'], this.clickListener);
    });
  }
  tooltipHandler() {
    return this.icon_;
  }
}
Component.registerComponent('SettingsButton', SettingsButton);
export default SettingsButton;
