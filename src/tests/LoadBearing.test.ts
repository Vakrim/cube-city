import { BlockType } from "../Block";
import { LoadBearing } from "../components/LoadBearing";
import { WorldMap } from "../components/WorldMap";
import { Config } from "../Config";
import { Game } from "../Game";

describe(LoadBearing, () => {
  it("calculates support", () => {
    const game = new Game();

    game.addComponentInstance(Config, {
      WORLD_MAP_SIZE: 6,
    });

    game.addComponentInstance("WorldMapRenderer", {
      addBlock: jest.fn(),
    });

    const worldMap = game.createComponent(WorldMap);

    const loadBearing = game.createComponent(LoadBearing);

    worldMap.setBlock({ x: 1, y: 0, z: 1 }, { type: BlockType.Rock });
    worldMap.setBlock({ x: 1, y: 1, z: 1 }, { type: BlockType.Rock });
    worldMap.setBlock({ x: 1, y: 2, z: 1 }, { type: BlockType.Rock });

    worldMap.setBlock({ x: 1, y: 2, z: 2 }, { type: BlockType.WoodenSupport });
    worldMap.setBlock({ x: 1, y: 2, z: 3 }, { type: BlockType.WoodenSupport });
    worldMap.setBlock({ x: 1, y: 2, z: 4 }, { type: BlockType.WoodenSupport });

    worldMap.setBlock({ x: 1, y: 3, z: 3 }, { type: BlockType.WoodenSupport });

    worldMap.setBlock({ x: 2, y: 2, z: 1 }, { type: BlockType.WoodenSupport });
    worldMap.setBlock({ x: 3, y: 2, z: 1 }, { type: BlockType.WoodenSupport });
    worldMap.setBlock({ x: 4, y: 2, z: 1 }, { type: BlockType.WoodenSupport });
    worldMap.setBlock({ x: 5, y: 2, z: 1 }, { type: BlockType.WoodenSupport });
    worldMap.setBlock({ x: 2, y: 1, z: 1 }, { type: BlockType.WoodenSupport });

    loadBearing.calculateSupport();

    function getLoadAt(x: number, y: number, z: number) {
      const index = worldMap.getIndex({ x, y, z });
      return loadBearing.load[index];
    }

    function getSumLoadAt(x: number, y: number, z: number) {
      const load = getLoadAt(x, y, z);

      return load ? load.horizontal + load.vertical : null;
    }

    expect(getSumLoadAt(1, 0, 1)).toEqual(Infinity);
    expect(getLoadAt(1, 1, 1)).toEqual({ horizontal: 0, vertical: Infinity });
    expect(getSumLoadAt(1, 1, 1)).toEqual(Infinity);
    expect(getSumLoadAt(1, 2, 1)).toEqual(Infinity);

    expect(getSumLoadAt(1, 2, 2)).toEqual(2);
    expect(getSumLoadAt(1, 2, 3)).toEqual(1);
    expect(getSumLoadAt(1, 2, 4)).toEqual(0);

    expect(getSumLoadAt(1, 3, 3)).toEqual(1);

    expect(getSumLoadAt(2, 2, 1)).toEqual(4);
    expect(getSumLoadAt(3, 2, 1)).toEqual(2);
    expect(getSumLoadAt(4, 2, 1)).toEqual(1);
    expect(getSumLoadAt(5, 2, 1)).toEqual(0);
    expect(getSumLoadAt(2, 1, 1)).toEqual(2);
  });
});
