import "./style.css";
import { renderer } from "./renderer";
import { WorldMapRenderer } from "./WorldMapRenderer";
import { WORLD_MAP_SIZE, WorldMap } from "./WorldMap";
import { GameCamera } from "./GameCamera";
import { MapControls } from "three/examples/jsm/Addons.js";
import { World } from "./World";
import { generatePilar } from "./generatePilar";
import { BlockType } from "./Block";

function main() {
  const world = new World();

  world.createFloor();
  world.createLight();

  const camera = new GameCamera();

  const gameMapRenderer = new WorldMapRenderer(world.scene);

  const gameMap = new WorldMap(gameMapRenderer);

  gameMap.setBlock({ x: 0, y: 0, z: 0 }, { type: BlockType.Rock });
  gameMap.setBlock({ x: WORLD_MAP_SIZE - 1, y: 0, z: 0 }, { type: BlockType.Rock });
  gameMap.setBlock({ x: 0, y: 0, z: WORLD_MAP_SIZE - 1 }, { type: BlockType.Rock });
  gameMap.setBlock({ x: WORLD_MAP_SIZE - 1, y: 0, z: WORLD_MAP_SIZE - 1 }, { type: BlockType.Rock });

  generatePilar(5, 5, 3, 20, gameMap);

  generatePilar(13, 5, 4, 16, gameMap);

  const controls = new MapControls(camera.camera, renderer.domElement);

  function render() {
    renderer.render(world.scene, camera.camera);

    requestAnimationFrame(render);
  }

  render();

  // Handle window resize
  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

main();
