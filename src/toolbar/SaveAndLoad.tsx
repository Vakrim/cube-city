import { WorldMap } from "../components/WorldMap";
import { useGameComponent } from "./useGameComponent";

export const SaveAndLoad = () => {
  const worldMap = useGameComponent(WorldMap);

  return (
    <div className="save-and-load">
      <div
        className="save-and-load-item"
        onClick={() => {
          worldMap.save();
        }}
      >
        Save
      </div>
      <div
        className="save-and-load-item"
        onClick={() => {
          worldMap.load();
        }}
      >
        Load
      </div>
      <div
        className="save-and-load-item"
        onClick={() => {
          worldMap.loadBonkers();
        }}
      >
        Load Bonkers
      </div>
    </div>
  );
};
