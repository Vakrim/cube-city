export class ReactStore<T> {
  private listeners: Listener[] = [];
  snapshot: T;

  constructor(private snapshotFactory: () => T) {
    this.snapshot = snapshotFactory();
  }

  subscribe = (onStoreChange: Listener): Listener => {
    this.listeners.push(onStoreChange);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== onStoreChange);
    };
  };

  getSnapshot() {
    return this.snapshot;
  }

  notify() {
    this.snapshot = this.snapshotFactory();
    this.listeners.forEach((listener) => listener());
  }
}

type Listener = () => void;
