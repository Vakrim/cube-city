import { WorldMap } from "./WorldMap";
import { BlockType } from "./Block";

export function generatePilar(
  px: number,
  pz: number,
  radius: number,
  height: number,
  gameMap: WorldMap
) {
  for (let x = -radius; x <= radius; x++) {
    for (let z = -radius; z <= radius; z++) {
      const distance = Math.sqrt(x ** 2 + z ** 2);

      if (distance <= radius) {
        const thisHeight = height - 4 + Math.floor(Math.random() * 8);

        for (let y = 0; y < thisHeight; y++) {
          gameMap.setBlock(
            { x: px + x, y, z: pz + z },
            { type: BlockType.Rock }
          );
        }
      }
    }
  }
}
