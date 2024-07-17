import { BlockType } from "../Block";
import { LoadBearing } from "../components/LoadBearing";
import { WorldMap } from "../components/WorldMap";
import { Config } from "../Config";
import { Game } from "../Game";

describe(LoadBearing, () => {
  it("calculates support", () => {
    const game = new Game();

    game.addComponentInstance(Config, {
      WORLD_MAP_SIZE: 5,
    });

    game.addComponentInstance("WorldMapRenderer", {
      addBlock: jest.fn(),
    });

    const worldMap = game.createComponent(WorldMap);

    worldMap.setBlock({ x: 1, y: 0, z: 1 }, { type: BlockType.Rock });
    worldMap.setBlock({ x: 1, y: 1, z: 1 }, { type: BlockType.Rock });
    worldMap.setBlock({ x: 1, y: 2, z: 1 }, { type: BlockType.Rock });

    worldMap.setBlock({ x: 1, y: 2, z: 2 }, { type: BlockType.WoodenSupport });
    worldMap.setBlock({ x: 1, y: 2, z: 3 }, { type: BlockType.WoodenSupport });
    worldMap.setBlock({ x: 1, y: 2, z: 4 }, { type: BlockType.WoodenSupport });

    const loadBearing = new LoadBearing(game);

    loadBearing.calculateSupport();

    const rockLoad = 100;

    function getLoadAt(x: number, y: number, z: number) {
      const index = worldMap.getIndex({ x, y, z });
      return loadBearing.load[index];
    }

    expect(getLoadAt(1, 0, 1)).toEqual(rockLoad);
    expect(getLoadAt(1, 1, 1)).toEqual(rockLoad);
    expect(getLoadAt(1, 2, 1)).toEqual(rockLoad);

    expect(getLoadAt(1, 2, 2)).toEqual(2);
    expect(getLoadAt(1, 2, 3)).toEqual(1);
    expect(getLoadAt(1, 2, 4)).toEqual(0);
  });
});
