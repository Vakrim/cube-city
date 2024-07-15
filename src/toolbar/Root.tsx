import { Construction, placeableBlocksTypes } from "../components/Construction";
import { useGameComponent } from "./useGameComponent";

export const Menu = () => {
  const construction = useGameComponent(Construction);

  return (
    <div>
      {placeableBlocksTypes.map((blockType) => (
        <div
          style={{
            fontWeight:
              construction.activeBlockType === blockType ? "bold" : "normal",
          }}
          key={blockType}
        >
          {blockType}{" "}
        </div>
      ))}
    </div>
  );
};
