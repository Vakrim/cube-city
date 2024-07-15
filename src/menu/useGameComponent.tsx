import { useContext, useSyncExternalStore } from "react";
import { ReactStore } from "./ReactStore";
import { GameContext } from "./GameContext";

export function useGameComponent<T extends HasReactStore>(
  componentConstructor: ConstructorOrHasReactStore<T>
) {
  const game = useContext(GameContext);

  if (!game) {
    throw new Error("Game not found");
  }

  const component = game.getComponent(componentConstructor);

  return useSyncExternalStore(component.reactStore.subscribe, () => component);
}

interface HasReactStore {
  reactStore: ReactStore;
}

type ConstructorOrHasReactStore<T extends HasReactStore> = new (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
) => T;
