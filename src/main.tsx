import "./style.css";
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
import { Toolbar } from "./components/Toolbar";
import { Config } from "./Config";
import { LoadBearing } from "./components/LoadBearing";
import { assetsManager } from "./AssetsManager";
import { AssetsPack } from "./AssetsPack";
import { Renderer } from "./components/Renderer";
import { Agency } from "./components/Agency";

async function main() {
  const assetsPack = await assetsManager.load();

  const game = new Game();

  game.addComponentInstance(AssetsPack, assetsPack);

  game.addComponentInstance(Config, new Config());

  game.addComponentInstance(GUI, new GUI());

  game.createComponent(Renderer);

  game.createComponent(World);

  game.createComponent(Controls);

  game.createComponent(GameCamera);

  game.createComponent(WorldMapRenderer);

  game.createComponent(WorldMap);

  game.createComponent(Agency);

  game.createComponent(Placing);

  game.createComponent(LoadBearing);

  game.createComponent(Construction);

  game.createComponent(Toolbar);

  generatePilar(15, 18, 3, 10, game.get(WorldMap));

  generatePilar(32, 32, 4, 16, game.get(WorldMap));
  generatePilar(36, 32, 8, 4, game.get(WorldMap));

  const stats = new Stats();
  stats.showPanel(0);
  document.body.appendChild(stats.dom);

  let lastTime = 0;

  game.init();

  const scene = game.get(Scene);
  const camera = game.get(Camera);

  function render(time?: number) {
    stats.begin();

    const deltaTime = time ? time - lastTime : 1 / 60;
    if (time) lastTime = time;

    game.update(deltaTime);

    game.get(Renderer).render(scene, camera);

    stats.end();

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main().catch(console.error);
