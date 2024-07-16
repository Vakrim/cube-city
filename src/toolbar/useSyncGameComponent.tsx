import { useSyncExternalStore } from "react";
import { ReactStore } from "./ReactStore";
import { useGameComponent } from "./useGameComponent";

export function useSyncGameComponent<T>(
  componentConstructor: ConstructorOrHasReactStore<T>,
) {
  const component = useGameComponent(componentConstructor);

  return useSyncExternalStore(component.reactStore.subscribe, () =>
    component.reactStore.getSnapshot(),
  ).component;
}

interface HasReactStore<T> {
  reactStore: ReactStore<T>;
}

type ConstructorOrHasReactStore<T> = new (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
) => HasReactStore<T>;
