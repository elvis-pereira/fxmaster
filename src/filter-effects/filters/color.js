import { packageId } from "../../constants.js";

export class ColorFilter extends PIXI.filters.AdjustmentFilter {
  constructor(options, id) {
    super();
    this.id = id;

    this.enabled = false;
    this.skipFading = false;
    this.configure(options);
  }

  static label = "FXMASTER.FilterEffectColor";
  static icon = "fas fa-palette";

  static get parameters() {
    return {
      color: {
        label: "FXMASTER.Tint",
        type: "color",
        value: {
          value: "#FFFFFF",
          apply: false,
        },
      },
      saturation: {
        label: "FXMASTER.Saturation",
        type: "range",
        max: 2.0,
        min: 0.0,
        step: 0.1,
        value: 1.0,
      },
      contrast: {
        label: "FXMASTER.Contrast",
        type: "range",
        max: 2.0,
        min: 0.0,
        step: 0.1,
        value: 1.0,
      },
      brightness: {
        label: "FXMASTER.Brightness",
        type: "range",
        max: 2.0,
        min: 0.0,
        step: 0.1,
        value: 1.0,
      },
      gamma: {
        label: "FXMASTER.Gamma",
        type: "range",
        max: 2.0,
        min: 0.0,
        step: 0.1,
        value: 1.0,
      },
    };
  }

  static get zeros() {
    return {
      red: 1,
      green: 1,
      blue: 1,
      saturation: 1,
      gamma: 1,
      brightness: 1,
      contrast: 1,
    };
  }

  static get default() {
    return Object.fromEntries(
      Object.entries(this.parameters).map(([parameterName, parameterConfig]) => [parameterName, parameterConfig.value]),
    );
  }

  configure(opts) {
    if (opts.color.apply) {
      const color = foundry.utils.Color.from(opts.color.value);
      opts.red = color.r;
      opts.green = color.g;
      opts.blue = color.b;
    } else {
      opts.red = opts.green = opts.blue = 1;
    }
    this.options = { ...this.constructor.default, ...opts };
  }

  applyOptions(opts = this.options) {
    if (!opts) return;
    const keys = Object.keys(opts);
    for (const key of keys) {
      this[key] = opts[key];
    }
  }

  animateOptions(values = this.options) {
    const data = {
      name: `${packageId}.${this.constructor.name}.${this.id}`,
      duration: 4000,
    };
    const anim = Object.keys(values).reduce((arr, key) => {
      arr.push({
        parent: this,
        attribute: key,
        to: values[key],
      });
      return arr;
    }, []);
    return CanvasAnimation.animate(anim, data);
  }

  step() {}

  play() {
    this.enabled = true;
    if (this.skipFading) {
      this.skipFading = false;
      this.applyOptions();
      return;
    }
    return this.animateOptions();
  }

  // So we can destroy object afterwards
  stop() {
    return new Promise((resolve) => {
      if (this.skipFading) {
        this.skipFading = false;
        this.enabled = false;
        this.applyOptions(this.constructor.zeros);
        resolve();
        return;
      }
      this.animateOptions(this.constructor.zeros).finally(() => {
        this.enabled = false;
        resolve();
      });
    });
  }
}
