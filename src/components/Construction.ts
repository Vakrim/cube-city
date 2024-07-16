import { Block, BlockType } from "../Block";
import { Game, GameComponent } from "../Game";
import { Controls } from "./Controls";
import { ReactStore } from "../toolbar/ReactStore";

export class Construction implements GameComponent {
  activeBlockType: BlockType = placeableBlocksTypes[0];

  reactStore = new ReactStore(this);

  constructor(private game: Game) {}

  update(): void {
    const controls = this.game.getComponent(Controls);

    for (let i = 1; i <= placeableBlocksTypes.length; i++) {
      if (
        controls.keyPressedThisFrame[
          i as unknown as keyof Controls["keyPressedThisFrame"]
        ]
      ) {
        this.setActiveBlockType(placeableBlocksTypes[i - 1]);
        break;
      }
    }
  }

  getSampleBlock(blockType: BlockType): Block {
    if (blockType === BlockType.WoodenSupport) {
      return {
        type: BlockType.WoodenSupport,
        variant: 0,
      };
    }

    return {
      type: blockType,
    };
  }

  setActiveBlockType(blockType: BlockType): void {
    this.activeBlockType = blockType;
    this.reactStore.notify();
  }
}

export const placeableBlocksTypes: BlockType[] = [
  BlockType.WoodenSupport,
  BlockType.House,
  BlockType.Lumberjack,
  BlockType.Sawmill,
];
