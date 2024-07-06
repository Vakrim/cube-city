import {
  AmbientLight,
  DirectionalLight,
  Mesh,
  PlaneGeometry, Scene
} from "three";
import { cellMaterial } from "./materials/cellMaterial";
import { WORLD_MAP_SIZE } from "./WorldMap";

export class World {
  scene = new Scene();

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
    const dirLight1 = new DirectionalLight(0xfff5e6, 5);
    dirLight1.position.set(WORLD_MAP_SIZE, WORLD_MAP_SIZE, WORLD_MAP_SIZE);
    dirLight1.castShadow = true;
    dirLight1.shadow.camera.left = -46;
    dirLight1.shadow.camera.right = 46;
    dirLight1.shadow.camera.top = 50;
    dirLight1.shadow.camera.bottom = -60;

    dirLight1.shadow.mapSize.width = 32 * 2048;
    dirLight1.shadow.mapSize.height = 32 * 2048;

    dirLight1.shadow.camera.updateProjectionMatrix();

    this.scene.add(dirLight1);

    const dirLight2 = new DirectionalLight(0x002288, 3);
    dirLight2.position.set(-1, -1, -1);
    this.scene.add(dirLight2);

    const ambientLight = new AmbientLight(0xffffff, 0.2);
    this.scene.add(ambientLight);
  }

  update(dt: number) {

  }
}
