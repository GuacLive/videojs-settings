
import videojs from 'video.js';

const Component = videojs.getComponent('Component');

const Overlay = videojs.extend(Component, {
    constructor: function(player, options){
        Component.call(this, player, options);
        this.hide();
    },
    createEl: function(type, props){
        var custom_class = this.options_['class'];
        custom_class = custom_class ? ' '+custom_class : '';
        var proto_component = Component.prototype;
        var container = proto_component.createEl.call(this, 'div',
            videojs.mergeOptions({className: 'vjs-info-overlay'+custom_class},
            props));
        this.createContent(container);
        return container;
    },
    createContent: function(){}
});
videojs.registerComponent('Overlay', Overlay);
export default Overlay;