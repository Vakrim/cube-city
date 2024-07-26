import { ArrowHelper, Scene, Vector3 } from "three";
import { Game } from "./Game";

export class Actor {
  position = new Vector3();

  mesh: ArrowHelper;

  constructor(
    public id: number,
    private game: Game,
  ) {
    this.mesh = new ArrowHelper(
      new Vector3(0, 1, 0),
      this.position,
      1,
      0xffff00,
    );
    this.game.get(Scene).add(this.mesh);
  }

  update() {
    this.mesh.position.copy(this.position);
  }

  dispose() {
    this.game.get(Scene).remove(this.mesh);
  }
}
