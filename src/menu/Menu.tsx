import { Construction } from "../components/Construction";
import { useGameComponent } from "./useGameComponent";

export const Menu = () => {
  const construction = useGameComponent(Construction);

  return (
    <div>
      <div>Active block: {construction.activeBlockType}</div>
    </div>
  );
};
