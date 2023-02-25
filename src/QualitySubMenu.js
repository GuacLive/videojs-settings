import videojs from "video.js";

const SubMenu = videojs.getComponent("SubMenu");
const MenuItem = videojs.getComponent("MenuItem");

class QualityMenuItem extends MenuItem {
  constructor(player, options) {
    options = videojs.mergeOptions(
      { selectable: true, selected: options.active || false },
      options
    );
    super(player, options);
  }
  handleClick(event) {
    super.handleClick.call(this, event);
    this.player().trigger("qualityRequested", this.options_.source);
  }
}
videojs.registerComponent("QualityMenuItem", QualityMenuItem);

class QualitySubMenu extends SubMenu {
  className = "vjs-quality-submenu";
  title = "Quality";
  addToMain = true;
  constructor(player, options, parent) {
    super(player, options, parent);
    this.addClass(this.className);
    var _this = this;
    this.title = player.localize("Quality");

    player.on("qualityRequested", function (event, newSource) {
      _this.updateCurrentSource(event, newSource);
    });

    // Update the list of menu items only when the list of sources change
    player.on(
      "playerSourcesChanged",
      function () {
        this.update();
      }.bind(this)
    );

    // Update the selected source with the source that was actually selected
    player.on(
      "qualitySelected",
      function (event, newSource) {
        _this.updateCurrentSource(event, newSource);
      }.bind(this)
    );

    // Since it's possible for the player to get a source before the selector is
    // created, make sure to update once we get a "ready" signal.
    player.one(
      "ready",
      function () {
        this.currentSource = player.src();

        this.update();
      }.bind(this)
    );
    this.createMenuItem();
    this.createTitleItem();
  }
  createItems() {
    this.player()
      .currentSources()
      .forEach((source) => {
        let item = new QualityMenuItem(this.player(), {
          active: source.src === this.currentSource,
          label: this.localize(source.label),
          src: source.src,
          callback: this.handleClick,
          source: source,
        });
        console.log(item);
        if (item.options_.active && this.menuItem && this.menuItem.minorLabel) {
          this.menuItem.minorLabel.innerHTML = this.localize(source.label);
        }
        this.items.push(item);
      });
  }
  updateCurrentSource(event, source) {
    if (this.menuItem && this.menuItem.minorLabel) {
      this.menuItem.minorLabel.innerHTML = this.localize(source.label);
    }
    this.currentSource = source.src;
    this.update();
  }
}

videojs.registerComponent("QualitySubMenu", QualitySubMenu);
export default QualitySubMenu;
