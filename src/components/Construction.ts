import { Block, BlockType } from "../Block";
import { Game, GameComponent } from "../Game";
import { Controls } from "./Controls";

export class Construction implements GameComponent {
  placeableBlocksTypes: BlockType[] = [
    BlockType.WoodenSupport,
    BlockType.House,
    BlockType.Lumberjack,
    BlockType.Sawmill,
  ];
  activeBlockType: BlockType = this.placeableBlocksTypes[0];

  constructor(private game: Game) {}

  update(deltaTime: number): void {
    const controls = this.game.getComponent(Controls);

    for (let i = 1; i <= this.placeableBlocksTypes.length; i++) {
      if (
        controls.keyPressedThisFrame[
          i as unknown as keyof Controls["keyPressedThisFrame"]
        ]
      ) {
        this.activeBlockType = this.placeableBlocksTypes[i];
        break;
      }
    }
  }

  getSampleBlock(blockType: BlockType): Block {
    if(blockType === BlockType.WoodenSupport) {
      return {
        type: BlockType.WoodenSupport,
        variant: 0,
      }
    }

    return {
      type: blockType,
    };
  }
}
