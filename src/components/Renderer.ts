import { PCFSoftShadowMap, WebGLRenderer } from "three";
import { Game, GameComponent } from "../Game";
import { GameCamera } from "./GameCamera";

export class Renderer extends WebGLRenderer implements GameComponent {
  constructor(private game: Game) {
    super({ antialias: true });
    this.setSize(window.innerWidth, window.innerHeight);
    this.shadowMap.enabled = true;
    this.shadowMap.type = PCFSoftShadowMap;
    document.body.appendChild(this.domElement);
  }

  init() {
    this.game
      .get(GameCamera)
      .updateAspectRatio(window.innerWidth / window.innerHeight);

    window.addEventListener("resize", () => {
      this.setSize(window.innerWidth, window.innerHeight);

      this.game
        .get(GameCamera)
        .updateAspectRatio(window.innerWidth / window.innerHeight);
    });
  }
}
