import videojs from 'video.js';

import SubMenu from './SubMenu';
import QualitySubMenu from './QualitySubMenu';
import ExtendedSubMenu from './ExtendedSubMenu';
const Menu = videojs.getComponent('Menu');
const Component = videojs.getComponent('Component');

export class SettingsMenu extends Menu {
	className = 'vjs-settings-menu';
	history = [];
	constructor(player, options, settings_button) {
		super(player, options);
		this.settings_button = settings_button;
		this.addClass(this.className);
		this.update();
		this.on(['tap', 'click', 'touchstart', 'touchend'], function (event) {
			event.stopPropagation();
		});
	}
	createEl() {
		var el = Component.prototype.createEl.call(this, 'div',
			{className: 'vjs-menu'});
		el.setAttribute('role', 'presentation');
		return el;
	}
	update() {
		this.children().forEach(this.removeChild.bind(this));
		this.createItems();
	}
	addSubMenu(menu) {
		this.addChild(menu);
		if (menu.menuItem)
			this.mainMenu.addChild(menu.menuItem);
		if (menu.menuItems) {
			menu.menuItems.forEach((item) => {
				this.mainMenu.addChild(item)
			})
		}
	}
	createItems() {
		this.mainMenu = new SubMenu(this.player_, this.options_, this);
		this.mainMenu.addClass('vjs-main-submenu');
		this.addChild(this.mainMenu);
		var menus = [];
		if (this.options_.quality) {
			menus.push(QualitySubMenu);
		}
		menus.push(ExtendedSubMenu);
		for (var i = 0; i < menus.length; i++) {
			this.addSubMenu(new menus[i](this.player_, this.options_, this));
		}
		this.selectMain(true);
	}
	selectMain(no_transition) {
		this.history = [];
		this.setActive(this.mainMenu, no_transition);
	}
	show(visible) {
		if (visible) {
			this.el_.style.height = '';
			this.el_.style.width = '';
			this.selectMain(true);
			this.addClass('vjs-lock-showing');
			return;
		}
		var _this = this;
		this.el_.style.opacity = '0';
		this.setTimeout(function () {
			this.el_.style.opacity = '';
			_this.removeClass('vjs-lock-showing');
		}, 100);
	}
	getSize(el) {
		el = el || this.el_;
		return {width: el.offsetWidth, height: el.offsetHeight};
	}
	setSize(size) {
		this.el_.style.height = size ? size.height + 'px' : '';
		this.el_.style.width = size ? size.width + 'px' : '';
	}
	setActive(menu, no_transition) {
		if (!no_transition && window.requestAnimationFrame) {
			var menu_el = menu.el();
			menu_el.style.maxHeight = this.player().el().offsetHeight - 5 + 'px';
			var _this = this, new_size = this.getSize(menu_el);
			this.setSize(this.getSize());
			window.requestAnimationFrame(function () {
				_this.addClass('vjs-size-transition');
				window.requestAnimationFrame(function () {
					var on_end = function () {
						_this.removeClass('vjs-size-transition');
						_this.setSize();
						_this.clearTimeout(timeout);
					};
					_this.setSize(new_size);
					_this.one('transitionend', on_end);
					var timeout = _this.setTimeout(on_end, 300);
				});
			});
		}
		this.active = menu;
		this.children().forEach(function (item) {
			item.toggleClass('vjs-active-submenu', item == menu);
		});
	}
	next(menu) {
		this.history.push(this.active);
		this.setActive(menu);
	}
	back() {
		this.setActive(this.history.pop() || this.mainMenu);
	}
};
videojs.registerComponent('SettingsMenu', SettingsMenu);
export default SettingsMenu;