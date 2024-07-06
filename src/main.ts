import "./style.css";
import { renderer } from "./renderer";
import { WorldMapRenderer } from "./WorldMapRenderer";
import { WorldMap } from "./WorldMap";
import { GameCamera } from "./GameCamera";
import { World } from "./World";
import { generatePilar } from "./generatePilar";
import { Controls } from "./Controls";
import Stats from "stats.js";
import { Placing } from "./Placing";
import { Game } from "./Game";

function main() {
  const game = new Game();

  game.addComponent(World);

  game.addComponent(GameCamera);

  game.addComponent(WorldMapRenderer);

  game.addComponent(WorldMap);

  game.addComponent(Controls);

  game.addComponent(Placing);

  generatePilar(15, 18, 3, 10, game.getComponent(WorldMap));

  generatePilar(32, 32, 4, 16, game.getComponent(WorldMap));
  generatePilar(36, 32, 8, 4, game.getComponent(WorldMap));


  const stats = new Stats();
  stats.showPanel(0);
  document.body.appendChild(stats.dom);

  let lastTime = 0;

  game.init();

  const scene = game.getComponent(World).scene;
  const camera = game.getComponent(GameCamera);

  function render(time: number) {
    stats.begin();

    if (!lastTime) {
      lastTime = time;
      requestAnimationFrame(render);
      return;
    }

    const deltaTime = time - lastTime;
    lastTime = time;

    game.update(deltaTime);

    renderer.render(scene, camera.camera);

    stats.end();

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

main();
