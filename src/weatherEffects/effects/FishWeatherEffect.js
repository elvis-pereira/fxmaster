import { AbstractWeatherEffect } from "./AbstractWeatherEffect.js";

export class FishWeatherEffect extends AbstractWeatherEffect {
  static get label() {
    return "Fish";
  }

  static get icon() {
    return "modules/fxmaster/assets/weatherEffects/icons/bats.png";
  }

  static get parameters() {
    return foundry.utils.mergeObject(super.parameters, {
      density: { min: 0.001, value: 0.025, max: 0.1, step: 0.001, decimals: 3 },
      "-=direction": undefined,
    });
  }

  getParticleEmitters() {
    return [this._getBatsEmitter(this.parent)];
  }

  _getBatsEmitter(parent) {
    const d = canvas.dimensions;
    const p = (d.width / d.size) * (d.height / d.size) * this.options.density.value;
    const config = foundry.utils.mergeObject(
      this.constructor.CONFIG,
      {
        spawnRect: {
          x: d.sceneRect.x,
          y: d.sceneRect.y,
          w: d.sceneRect.width,
          h: d.sceneRect.height,
        },
        maxParticles: p,
        frequency: this.constructor.CONFIG.lifetime.min / p,
      },
      { inplace: false },
    );
    this.applyOptionsToConfig(config);

    const animSheets = [
      {
        framerate: "6",
        textures: Array.fromRange(6).map(
          (index) => `modules/fxmaster/assets/weatherEffects/effects/barramundi/barramundi_${index}.png`,
        ),

        loop: true,
      },
    ];
    const emitter = new PIXI.particles.Emitter(parent, animSheets, config);
    emitter.particleConstructor = PIXI.particles.AnimatedParticle;
    return emitter;
  }

  /**
   * Configuration for the Bats particle effect
   * @type {Object}
   */
  static CONFIG = foundry.utils.mergeObject(
    SpecialEffect.DEFAULT_CONFIG,
    {
      alpha: {
        list: [
          { value: 0, time: 0 },
          { value: 1, time: 0.02 },
          { value: 1, time: 0.98 },
          { value: 0, time: 1 },
        ],
        isStepped: false,
      },
      scale: {
        list: [
          { value: 0.02, time: 0 },
          { value: 0.25, time: 0.05 },
          { value: 0.25, time: 0.95 },
          { value: 0.02, time: 1 },
        ],
        isStepped: false,
      },
      speed: {
        start: 300,
        end: 320,
        minimumSpeedMultiplier: 0.5,
      },
      startRotation: {
        min: 0,
        max: 360,
      },
      lifetime: {
        min: 20,
        max: 40,
      },
      blendMode: "normal",
      emitterLifetime: -1,
    },
    { inplace: false },
  );
}
