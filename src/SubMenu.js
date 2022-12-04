import videojs from "video.js";

const Menu = videojs.getComponent("Menu");
const MenuItem = videojs.getComponent("MenuItem");
const Component = videojs.getComponent("Component");

class SubMenu extends Menu {
  addToMain = true;
  constructor(player, options, parent) {
    Menu.call(this, player, options);
    this.items = [];
    this.parent = parent;
    this.createMenuItem();
    this.createTitleItem();
    if (this.className) {
      this.addClass(this.className);
    }
    this.update();
  }
  createEl() {
    var el = Component.prototype.createEl.call(this, "div", {
      className: "vjs-menu-content",
    });
    el.setAttribute("role", "menu");
    return el;
  }
  createTitleItem() {
    if (!this.title) {
      return;
    }
    var _this = this;
    var title = new MenuItem(this.player_, { label: this.title });

    title.addClass("vjs-submenu-title");
    title.on(["tap", "click"], function () {
      _this.parent.back();
    });
    this.addChild(title);
    this.titleItem = title;
  }
  createMenuItem() {
    if (!this.title || !this.addToMain || typeof this.title == "undefined") {
      return;
    }
    var player = this.player(),
      _this = this;
    var item = (this.menuItem = new MenuItem(player, { label: this.title }));
    item.addClass("vjs-menu-item-next");
    var span = videojs.dom.createEl("span", {
      className: "vjs-menu-item-content",
    });
    item.minorLabel = videojs.dom.createEl("span", {
      className: "vjs-minor-label",
    });
    item.contentLabel = videojs.dom.createEl("span");
    span.appendChild(item.contentLabel);
    span.appendChild(item.minorLabel);
    item.el().insertBefore(span, item.el().firstChild);
    item.on(["tap", "click"], function () {
      _this.parent.next(_this);
    });
  }
  update() {
    this.items.forEach((item) => {
      this.removeChild(item);
    });
    this.items = [];
    if (this.createItems) {
      this.createItems();
    }
    this.items.forEach((item) => {
      this.addChild(item);
      if (this.handleItemClick) {
        item.on(["tap", "click"], this.handleItemClick.bind(this, item));
      }
    });
  }
}
videojs.registerComponent("SubMenu", SubMenu);
export default SubMenu;
