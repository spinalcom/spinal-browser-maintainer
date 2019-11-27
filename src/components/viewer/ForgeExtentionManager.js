class ForgeExtentionManager {
  constructor() {
    this.extentions = [];
    this.viewer = null;
  }

  getExtentions() {
    return this.extentions;
  }

  addExtention(name) {
    if (this.viewer !== null) { this.viewer.loadExtension(name, {}); }

    this.extentions.push(name);
  }
}

let forgeExtentionManager = new ForgeExtentionManager();
export { ForgeExtentionManager };
export { forgeExtentionManager };
export default forgeExtentionManager;
if (typeof window.spinal === "undefined") window.spinal = {};
if (typeof window.spinal.ForgeExtentionManager === "undefined") {
  window.spinal.ForgeExtentionManager = forgeExtentionManager;
}
