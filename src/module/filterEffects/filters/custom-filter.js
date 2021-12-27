const _tempRect = new PIXI.Rectangle();

export class CustomFilter extends PIXI.Filter {
  constructor(...args) {
    super(...args);
    this.boundsPadding = new PIXI.Point(0, 0);

    if (!this.uniforms.filterMatrix) this.uniforms.filterMatrix = new PIXI.Matrix();
  }

  apply(filterManager, input, output, clear) {
    const filterMatrix = this.uniforms.filterMatrix;

    if (filterMatrix) {
      const { sourceFrame, destinationFrame, target } = filterManager.activeState;

      filterMatrix.set(destinationFrame.width, 0, 0, destinationFrame.height, sourceFrame.x, sourceFrame.y);

      const worldTransform = target.transform.worldTransform.copyTo(PIXI.Matrix.TEMP_MATRIX);

      worldTransform.invert();

      const localBounds = target.getLocalBounds(_tempRect);
      filterMatrix.prepend(worldTransform);
      filterMatrix.translate(-localBounds.x, -localBounds.y);
      filterMatrix.scale(1.0 / localBounds.width, 1.0 / localBounds.height);
    }

    filterManager.applyFilter(this, input, output, clear);
  }
}
