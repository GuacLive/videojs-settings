
import videojs from 'video.js';

const SubMenu = videojs.getComponent('SubMenu');
const MenuItem = videojs.getComponent('MenuItem');
const Component = videojs.getComponent('Component');

const ExtendedSubMenu = videojs.extend(SubMenu, {
	className: 'vjs-select-value-submenu',
    title: '',
	addToMain: true,
	menuItems: [],
    constructor: function(player, options, parent) {
        SubMenu.call(this, player, options, parent);
    },
    createEl: function() {
        var el = Component.prototype.createEl.call(this, 'div',
            {className: 'vjs-menu-content'});
        el.setAttribute('role', 'menu');
        return el;
    },
	createTitleItem: function() {},
    createMenuItem: function() {
        this.menuItems = []
        if (this.options_.popout) {
            this.createMenuItemInternal('Popout', 'guac-popout');
        }
        if (this.options_.report) {
            this.createMenuItemInternal('Report', 'guac-report');
		}
        if (this.options_.info) {
        	this.createMenuItemInternal('Video Stats', 'guac-info-overlay');
        }
    },
    createMenuItemInternal: function(title, event){
        var player = this.player();
        var item = new MenuItem(player, {label: this.player().localize(title)});
        var span = videojs.dom.createEl('span', {className: 'vjs-menu-item-content'});
        item.minorLabel = videojs.dom.createEl('span', {className: 'vjs-minor-label'});
        item.contentLabel = videojs.dom.createEl('span');
        span.appendChild(item.contentLabel);
        span.appendChild(item.minorLabel);
        item.el().insertBefore(span, item.el().firstChild);
        item.on(['tap', 'click'], function(){
            this.player().trigger(event);
        });
        this.menuItems.push(item)
    },
});
videojs.registerComponent('ExtendedSubMenu', ExtendedSubMenu);
export default ExtendedSubMenu;