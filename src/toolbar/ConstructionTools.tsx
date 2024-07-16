import { blockNames } from "../Block";
import { Construction, placeableBlocksTypes } from "../components/Construction";
import { useSyncGameComponent } from "./useSyncGameComponent";

export const ConstructionTools = () => {
  const construction = useSyncGameComponent(Construction);

  return (
    <div className="construction-tools">
      {placeableBlocksTypes.map((blockType) => (
        <div
          key={blockType}
          className="construction-tools-item"
          style={{
            fontWeight:
              construction.activeBlockType === blockType ? "bold" : "normal",
          }}
          onClick={() => construction.setActiveBlockType(blockType)}
        >
          {blockNames[blockType]}
        </div>
      ))}
    </div>
  );
};
