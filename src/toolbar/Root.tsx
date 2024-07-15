import { blockNames } from "../Block";
import { Construction, placeableBlocksTypes } from "../components/Construction";
import { useGameComponent } from "./useGameComponent";

export const Menu = () => {
  const construction = useGameComponent(Construction);

  return (
    <div className="construction-list">
      {placeableBlocksTypes.map((blockType) => (
        <div
          key={blockType}
          className="construction-list-item"
          style={{
            fontWeight:
              construction.activeBlockType === blockType ? "bold" : "normal",
          }}
          onClick={() => construction.setActiveType(blockType)}
        >
          {blockNames[blockType]}
        </div>
      ))}
    </div>
  );
};
