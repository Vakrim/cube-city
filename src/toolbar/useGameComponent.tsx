import { useContext } from "react";
import { GameContext } from "./GameContext";

export function useGameComponent<T>(componentConstructor: Constructor<T>) {
  const game = useContext(GameContext);

  if (!game) {
    throw new Error("Game not found");
  }

  return game.getComponent(componentConstructor);
}

type Constructor<T> = new (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
) => T;
