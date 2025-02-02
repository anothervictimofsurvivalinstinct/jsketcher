import {MObject, MObjectIdGenerator} from './mobject';
import {MBrepFace, MFace} from './mface';
import {MEdge} from './medge';
import {MVertex} from './mvertex';
import CSys, {CartesianCSys} from 'math/csys';
import {state, StateStream} from "lstream";
import {Matrix3x4} from "math/matrix";
import {Shell} from "brep/topo/shell";
import {TopoObject} from "brep/topo/topo-object";
import {EntityKind} from "cad/model/entities";

export class MShell extends MObject {

  static TYPE = EntityKind.SHELL;

  csys: CartesianCSys;

  shell;
  faces: MFace[] = [];
  edges: MEdge[] = [];
  vertices: MVertex[]  = [];

  location$: StateStream<Matrix3x4> = state(new Matrix3x4());

  constructor() {
    super(MShell.TYPE, MObjectIdGenerator.next(MShell.TYPE, 'S'));
  }

  traverse(callback: (obj: MObject) => void): void {
    callback(this);
    this.faces.forEach(i => i.traverse(callback));
    this.edges.forEach(i => i.traverse(callback));
    this.vertices.forEach(i => i.traverse(callback));
  }

  get parent() {
    return null;
  }

  get location() {
    return this.location$.value;
  }
}

export class MBrepShell extends MShell {

  brepShell: Shell;
  csys: CartesianCSys;
  brepRegistry: Map<TopoObject, MObject>;

  constructor(shell, csys?) {
    super();
    this.brepShell = shell;
    this.csys = csys || CSys.ORIGIN;
    this.brepRegistry = new Map();
    
    let faceCounter = 0;
    let edgeCounter = 0;
    let vertexCounter = 0;

    for (const brepFace of this.brepShell.faces) {
      const mFace = new MBrepFace(brepFace.data.id || (this.id + '/F:' + faceCounter++), this, brepFace);
      this.faces.push(mFace);
      this.brepRegistry.set(brepFace, mFace);
    }

    for (const brepEdge of this.brepShell.edges) {
      const mEdge = new MEdge(brepEdge.data.id || (this.id + '/E:' + edgeCounter++), this, brepEdge);
      this.edges.push(mEdge);
      this.brepRegistry.set(brepEdge, mEdge);
    }

    for (const brepVertex of this.brepShell.vertices) {
      const mVertex = new MVertex(brepVertex || (this.id + '/V:' + vertexCounter++), this, brepVertex);
      this.vertices.push(mVertex);
      this.brepRegistry.set(brepVertex, mVertex);
    }
  }

  get topology(): TopoObject {
    return this.brepShell;
  }

}
