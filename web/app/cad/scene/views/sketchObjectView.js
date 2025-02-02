import {CurveBasedView} from './curveBasedView';

export class SketchObjectView extends CurveBasedView {
  
  constructor(ctx, mSketchObject, sketchToWorldTransformation) {
    const color = mSketchObject.construction ? 0x964B00 : 0x0000FF;
    const tess = mSketchObject.sketchPrimitive.tessellate(10).map(sketchToWorldTransformation.apply).map(v => v.data());
    super(ctx, mSketchObject, tess, 3, color);
    this.representation.onDblclick = () => {
      ctx.sketcherService.sketchFace(this.model.face);
    }
  }
}
