import {
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  NearestFilter,
  OrthographicCamera,
  PlaneGeometry,
  RepeatWrapping,
  Scene,
  TextureLoader,
  WebGLRenderer,
} from "three";
import "./style.css";
import { cellMaterial } from "./materials/cellMaterial";
import { createCamera } from "./camera";
import { renderer } from "./renderer";

class World {
  scene = new Scene();

  createFloor() {
    const planeGeometry = new PlaneGeometry(50, 50);

    const floor = new Mesh(planeGeometry, cellMaterial);
    floor.rotation.x = -Math.PI / 2;

    this.scene.add(floor);
  }
}

function main() {
  const world = new World();

  const camera = createCamera();

  // Create the orthographic camera

  // Create the renderer

  // Load the texture

  // cellTexture.minFilter = NearestFilter;

  // Create a plane geometry and a basic material with the texture
  const wallGeometry = new PlaneGeometry(1, 1);

  // Create the plane mesh and add it to the scene
  const wall = new Mesh(wallGeometry, tileMaterial);
  wall.position.set(0, 0.5, 0);
  scene.add(wall);

  function render() {
    renderer.render(world.scene, camera);

    requestAnimationFrame(render);
  }

  render();

  // Handle window resize
  window.addEventListener("resize", () => {
    const aspectRatio = window.innerWidth / window.innerHeight;
    camera.left = -cameraSize * aspectRatio;
    camera.right = cameraSize * aspectRatio;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

main();
