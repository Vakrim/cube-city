import {
  AmbientLight,
  DirectionalLight,
  Mesh,
  PlaneGeometry,
  Scene,
} from "three";
import { cellMaterial } from "../materials/cellMaterial";
import { WORLD_MAP_SIZE } from "./WorldMap";
import { Game, GameComponent } from "../Game";

export class World implements GameComponent {
  scene = new Scene();

  constructor(public game: Game) {
    this.game.addComponentInstance(Scene, this.scene);
  }

  init(): void {
    this.createFloor();
    this.createLight();
  }

  createFloor() {
    const planeGeometry = new PlaneGeometry(WORLD_MAP_SIZE, WORLD_MAP_SIZE);

    const floor = new Mesh(planeGeometry, cellMaterial);
    floor.position.x = WORLD_MAP_SIZE / 2 - 0.5;
    floor.position.y = -0.5;
    floor.position.z = WORLD_MAP_SIZE / 2 - 0.5;

    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  createLight() {
    const sunLight = new DirectionalLight(0xfff5e6, 5);
    sunLight.position.set(WORLD_MAP_SIZE, WORLD_MAP_SIZE, 2 * WORLD_MAP_SIZE);
    sunLight.castShadow = true;

    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = 0.0001;

    sunLight.shadow.camera.left = -46;
    sunLight.shadow.camera.right = 46;
    sunLight.shadow.camera.top = 50;
    sunLight.shadow.camera.bottom = -60;

    sunLight.shadow.camera.updateProjectionMatrix();

    this.scene.add(sunLight);

    const ambientLight = new AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
  }

  update() {}
}
