import "./style.css";
import { renderer } from "./renderer";
import { WorldMapRenderer } from "./WorldMapRenderer";
import { WORLD_MAP_SIZE, WorldMap } from "./WorldMap";
import { GameCamera } from "./GameCamera";
import { World } from "./World";
import { generatePilar } from "./generatePilar";
import { BlockType } from "./Block";
import { Controls } from "./Controls";
import { Mesh, MeshLambertMaterial } from "three";
import Stats from "stats.js";

function main() {
  const world = new World();

  world.createFloor();
  world.createLight();

  const camera = new GameCamera();
  camera.addControlsListeners(window);

  const worldMapRenderer = new WorldMapRenderer(world.scene);

  const worldMap = new WorldMap(worldMapRenderer);

  worldMap.setBlock({ x: 0, y: 0, z: 0 }, { type: BlockType.Rock });
  worldMap.setBlock(
    { x: WORLD_MAP_SIZE - 1, y: 0, z: 0 },
    { type: BlockType.Rock }
  );
  worldMap.setBlock(
    { x: 0, y: 0, z: WORLD_MAP_SIZE - 1 },
    { type: BlockType.Rock }
  );
  worldMap.setBlock(
    { x: WORLD_MAP_SIZE - 1, y: 0, z: WORLD_MAP_SIZE - 1 },
    { type: BlockType.Rock }
  );

  generatePilar(5, 5, 3, 10, worldMap);

  generatePilar(13, 5, 4, 16, worldMap);

  new MapControls(camera.camera, renderer.domElement);

  const controls = new Controls(camera.camera, world.scene);
  controls.addListeners(renderer.domElement);

  const boxHelper = worldMapRenderer.createMesh({
    type: BlockType.Road,
    variant: 0,
  });
  boxHelper.material = boxHelper.material.clone();

  boxHelper.material.opacity = 0.5;
  (boxHelper.material as MeshLambertMaterial).color.set(0x75e6da);

  boxHelper.castShadow = false;
  boxHelper.receiveShadow = false;

  world.scene.add(boxHelper);

  const stats = new Stats();
  stats.showPanel(0);
  document.body.appendChild(stats.dom);

  let lastTime = 0;

  function render(time: number) {
    stats.begin();

    if (!lastTime) {
      lastTime = time;
      requestAnimationFrame(render);
      return;
    }

    const deltaTime = time - lastTime;
    lastTime = time;

    const intersects = controls.getIntersect(worldMapRenderer.getAllMeshes());

    if (intersects.length > 0) {
      const intersect = intersects[0];

      if (intersect.face) {
        boxHelper.position
          .copy(intersect.point)
          .add(intersect.face.normal.clone().multiplyScalar(0.5))
          .round();
      }
    }

    camera.update(deltaTime);

    renderer.render(world.scene, camera.camera);

    stats.end();

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

main();
