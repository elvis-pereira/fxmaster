import fog from "./shaders/fog.frag";
import customVertex2D from "./shaders/customvertex2D.vert";
import { CustomFilter } from "./custom-filter.js";

export class FXFogFilter extends CustomFilter {
  constructor(options) {
    super(customVertex2D, fog);
    this.enabled = false;
    this.skipFading = false;

    this.color = new Float32Array([0.0, 0.0, 0.0, 1]);
    this.dimensions = new Float32Array([1.0, 1.0]);
    this.time = 0.0;
    this.density = 0.65;

    this.configure({
      time: this.time,
      dimensions: this.dimensions,
      color: this.color,
      density: this.density,
      ...options,
    });
  }

  // apply(filterManager, input, output, clear) {
  //   this.uniforms.color = this.color;
  //   this.uniforms.dimensions = this.dimensions;
  //   this.uniforms.time = this.time;
  //   this.uniforms.density = this.density;
  //   this.uniforms.dimensions = this.dimensions;

  //   filterManager.applyFilter(this, input, output, clear);
  // }

  static get label() {
    return "Fog";
  }

  static get faIcon() {
    return "fas fa-cloud";
  }

  static get parameters() {
    return {};
  }

  static get zeros() {
    return {};
  }

  static get default() {
    return Object.fromEntries(
      Object.entries(this.parameters).map(([parameterName, parameterConfig]) => [parameterName, parameterConfig.value]),
    );
  }

  configure(opts) {
    const newUniforms = { ...this.uniforms, ...this.constructor.default, ...opts };
    Object.entries(newUniforms).forEach(([uniform, value]) => (this.uniforms[uniform] = value));
    this.options = { ...this.constructor.default, ...opts };
  }

  applyOptions(opts = this.options) {
    if (!opts) return;
    const keys = Object.keys(opts);
    for (const key of keys) {
      this[key] = opts[key];
    }
  }

  step() {
    this.uniforms.time = canvas.app.ticker.lastTime / 4;
  }

  play() {
    this.enabled = true;
    // this.applyOptions();
    return;
  }

  // So we can destroy object afterwards
  stop() {
    return new Promise((resolve) => {
      this.enabled = false;
      // this.applyOptions(this.constructor.zeros);
      resolve();
    });
  }
}
