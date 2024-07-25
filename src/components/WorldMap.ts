import { Vector3 } from "three";
import { Block, BlockType } from "../Block";
import { database } from "../Database";
import { Game, GameComponent } from "../Game";
import { Position } from "../Position";
import { WorldMapRenderer } from "./WorldMapRenderer";
import { Config } from "../Config";
import { LoadBearing } from "./LoadBearing";

export class WorldMap implements GameComponent {
  worldMapSize = this.game.get(Config).WORLD_MAP_SIZE;
  map: (Block | null)[] = Array(this.worldMapSize ** 3).fill(null);
  render: WorldMapRenderer;

  constructor(private game: Game) {
    this.render = game.get(WorldMapRenderer);
  }

  init() {
    this.setBlock({ x: 0, y: 0, z: 0 }, { type: BlockType.Rock });
    this.setBlock(
      { x: this.worldMapSize - 1, y: 0, z: 0 },
      { type: BlockType.Rock },
    );
    this.setBlock(
      { x: 0, y: 0, z: this.worldMapSize - 1 },
      { type: BlockType.Rock },
    );
    this.setBlock(
      { x: this.worldMapSize - 1, y: 0, z: this.worldMapSize - 1 },
      { type: BlockType.Rock },
    );
  }

  setBlock(position: Position, block: Block) {
    const index = this.getIndex(position);

    const existingBlock = this.map[index];

    if (existingBlock) {
      this.render.removeBlock(existingBlock);
    }

    this.map[index] = block;
    this.render.addBlock(position, block);

    this.game.get(LoadBearing).dirty = true;
  }

  getBlock(position: Position) {
    const index = this.getIndex(position);
    return this.map[index];
  }

  deleteBlock(position: Position) {
    const index = this.getIndex(position);

    const block = this.map[index];

    if (block) {
      this.render.removeBlock(block);
      this.map[index] = null;

      this.game.get(LoadBearing).dirty = true;
    }
  }

  getIndex(position: Position) {
    return (
      position.x +
      position.y * this.worldMapSize +
      position.z * this.worldMapSize ** 2
    );
  }

  getPosition(index: number) {
    const x = index % this.worldMapSize;
    const y = Math.floor(index / this.worldMapSize) % this.worldMapSize;
    const z = Math.floor(index / this.worldMapSize ** 2);

    return new Vector3(x, y, z);
  }

  isInBounds(position: Position) {
    return (
      position.x >= 0 &&
      position.y >= 0 &&
      position.z >= 0 &&
      position.x < this.worldMapSize &&
      position.y < this.worldMapSize &&
      position.z < this.worldMapSize
    );
  }

  async save() {
    await database.setItem("worldMap", this.map);
  }

  clear() {
    this.map.forEach((block) => {
      if (block) {
        this.render.removeBlock(block);
      }
    });

    this.map.fill(null);
  }

  async load() {
    const map = await database.getItem<(Block | null)[]>("worldMap");

    if (!map) {
      return;
    }

    this.clear();

    map.forEach((block, index) => {
      if (block) {
        this.setBlock(this.getPosition(index), block);
      }
    });
  }

  async saveToFile(fileName: string) {
    const jsonString = JSON.stringify(this.map);

    const readableStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(jsonString));
        controller.close();
      },
    });

    const compressionStream = new CompressionStream("gzip");

    const compressedStream = readableStream.pipeThrough(compressionStream);

    const compressedBlob = await new Response(compressedStream).blob();

    const url = URL.createObjectURL(compressedBlob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.json.gz`;

    a.click();

    URL.revokeObjectURL(url);
  }

  async loadFromFile(levelName: string) {
    const response = await fetch(`/saves/${levelName}.json.gz`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const map = (await new Response(response.body).json()) as (Block | null)[];

    this.clear();

    map.forEach((block, index) => {
      if (block) {
        this.setBlock(this.getPosition(index), block);
      }
    });
  }
}
