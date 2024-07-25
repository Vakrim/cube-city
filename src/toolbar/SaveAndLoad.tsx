import { WorldMap } from "../components/WorldMap";
import { useGameComponent } from "./useGameComponent";

const levels = ["empty", "spiral"];

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
          worldMap.saveToFile(`level-${levels.length + 1}`);
        }}
      >
        Save level to file
      </div>
      <div className="save-and-load-item-dropdown">
        Load level from file
        <div className="save-and-load-item-dropdown-wrapper">
          {levels.map((level) => (
            <div
              key={level}
              className="save-and-load-item-dropdown-option"
              onClick={() => worldMap.loadFromFile(level)}
            >
              {humanize(level)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function humanize(str: string) {
  return str
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}
