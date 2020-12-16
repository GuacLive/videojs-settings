import videojs from 'video.js';

const Menu = videojs.getComponent('Menu');
const MenuItem = videojs.getComponent('MenuItem');
const Component = videojs.getComponent('Component');

class PoweredBy extends MenuItem {
	constructor(player, options) {
		super(player, options);
		var ver = options.version;
		if (ver)
			options.label += ' ' + ver;
		MenuItem.call(this, player, options);
		this.addClass('vjs-powered-by');
	}
};

class ReportButton extends MenuItem {
	handleClick() {
		this.player_.trigger('guac-report');
	}
};

class InfoButton extends MenuItem {
	handleClick() {
		var overlay;
		if (overlay = this.player_.getChild('InfoOverlay')) {
			overlay.toggle(this);
		}
	}
};
export class PopupMenu extends Menu {
	className = 'vjs-rightclick-popup';
	popped = false;
	constructor(player, options) {
		super(player, options);
		this.addClass(this.className);
		this.hide();
		var _this = this;
		var opt = this.options_;
		_this.menuEnabled = true;
		this.addChild(new PoweredBy(player, {
			label: opt.poweredBy,
			version: opt.version
		}));
		if (opt.report) {
			opt.report = videojs.mergeOptions({label: this.localize('Report Stream')}, opt.report);
			this.addChild(new ReportButton(player, opt.report));
		}
		if (opt.info) {
			opt.info = videojs.mergeOptions({label: this.localize('Video Stats')}, opt.info);
			this.addChild(new InfoButton(player, opt.info));
		}
		function get_overflow_parent(el) {
			var parent = el;
			while (parent = parent.parentElement) {
				if (!parent) {
					return;
				}
				var style = window.getComputedStyle(parent);
				if (style.overflowX != 'visible' || style.overflowY != 'visible') {

					return parent;
				}
			}
		}
		function oncontextmenu(evt) {
			evt.preventDefault();
			if (_this.popped)
				return void _this.hide();
			_this.show();
			_this.check_items();
			var el = _this.el(), x = evt.clientX, y = evt.clientY;
			var max_right = window.innerWidth;
			var max_bottom = window.innerHeight;
			var parent = get_overflow_parent(el);
			if (parent) {
				var parent_rect = parent.getBoundingClientRect();
				max_right = Math.min(max_right, parent_rect.right);
				max_bottom = Math.min(max_bottom, parent_rect.bottom);
			}
			var left_shift = x + el.offsetWidth - max_right + 5;
			left_shift = Math.max(0, left_shift);
			var top_shift = y + el.offsetHeight - max_bottom + 5;
			top_shift = Math.max(0, top_shift);
			var rect = _this.player().el().getBoundingClientRect();
			el.style.left = Math.max(0, x - rect.left - left_shift) + 'px';
			el.style.top = Math.max(0, y - rect.top - top_shift) + 'px';
		}
		player.on('contextmenu', oncontextmenu);
		player.on(['tap', 'click'], function (evt) {
			if (_this.popped) {
				_this.hide();
				evt.stopPropagation();
				evt.preventDefault();
				return false;
			}
		});
		videojs.on(document, ['tap', 'click'], function () {
			if (_this.popped)
				_this.hide();
		});
		player.on('guac.wrapper_attached', this.check_items.bind(this));
		player.on('guac.wrapper_detached', this.check_items.bind(this));
		this.children().forEach(function (item) {
			item.on(['tap', 'click'], function () {_this.hide();});
		});
		player.enablePopupMenu = () => {
			if (!_this.menuEnabled) {
				player.off('contextmenu');
				player.on('contextmenu', oncontextmenu);
				_this.menuEnabled = true;
			}
		};
		player.disablePopupMenu = () => {
			if (_this.menuEnabled) {
				player.off('contextmenu');
				player.on('contextmenu', (evt) => {
					evt.preventDefault();
				});
				_this.menuEnabled = false;
			}
		};
	}
	createEl() {
		this.contentEl_ = videojs.dom.createEl('ul', {
			className: 'vjs-menu-content'
		});
		this.contentEl_.setAttribute('role', 'menu');
		var el = Component.prototype.createEl('div', {
			append: this.contentEl_,
			className: 'vjs-menu',
		});
		el.setAttribute('role', 'presentation');
		el.appendChild(this.contentEl_);
		var _this = this;
		videojs.on(el, 'click', function (event) {
			_this.hide();
			event.preventDefault();
			event.stopImmediatePropagation();
		});
		return el;
	}
	show() {
		this.removeClass('vjs-hidden');
		this.popped = true;
	}
	hide() {
		this.addClass('vjs-hidden');
		this.popped = false;
	}
	check_items() {
		this.children().forEach(function (item) {
			if (item.is_visible)
				item.toggleClass('vjs-hidden', !item.is_visible());
		});
	}
};
videojs.registerComponent('PopupMenu', PopupMenu);
export default PopupMenu;