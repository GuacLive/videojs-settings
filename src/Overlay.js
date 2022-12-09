import videojs from "video.js";

const Component = videojs.getComponent("Component");

class Overlay extends Component {
  constructor(player, options) {
    super(player, options);
    this.hide();
  }
  createEl(type, props) {
    let custom_class = this.options_.class;

    custom_class = custom_class ? " " + custom_class : "";
    const proto_component = Component.prototype;
    const container = proto_component.createEl.call(
      this,
      "div",
      videojs.mergeOptions(
        { className: "vjs-info-overlay" + custom_class },
        props
      )
    );

    this.createContent(container);
    return container;
  }
  createContent() {}
}
videojs.registerComponent("Overlay", Overlay);
export default Overlay;
