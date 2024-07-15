import "./style.css";
import { renderer } from "./renderer";
import { WorldMapRenderer } from "./components/WorldMapRenderer";
import { WorldMap } from "./components/WorldMap";
import { GameCamera } from "./components/GameCamera";
import { World } from "./components/World";
import { generatePilar } from "./generatePilar";
import { Controls } from "./components/Controls";
import Stats from "stats.js";
import { Placing } from "./components/Placing";
import { Game } from "./Game";
import { Camera, Scene } from "three";
import { GUI } from "dat.gui";
import { Construction } from "./components/Construction";
import { MenuRenderer } from "./components/MenuRenderer";

function main() {
  const game = new Game();

  game.addComponentInstance(GUI, new GUI());

  game.createComponent(World);

  game.createComponent(Controls);

  game.createComponent(GameCamera);

  game.createComponent(WorldMapRenderer);

  game.createComponent(WorldMap);

  game.createComponent(Placing);

  game.createComponent(Construction);

  game.createComponent(MenuRenderer);

  generatePilar(15, 18, 3, 10, game.getComponent(WorldMap));

  generatePilar(32, 32, 4, 16, game.getComponent(WorldMap));
  generatePilar(36, 32, 8, 4, game.getComponent(WorldMap));

  const stats = new Stats();
  stats.showPanel(0);
  document.body.appendChild(stats.dom);

  let lastTime = 0;

  game.init();

  const scene = game.getComponent(Scene);
  const camera = game.getComponent(Camera);

  function render(time?: number) {
    stats.begin();

    const deltaTime = time ? time - lastTime : 1 / 60;
    if (time) lastTime = time;

    game.update(deltaTime);

    renderer.render(scene, camera);

    stats.end();

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

main();
