export class ReactStore<T> {
  private listeners: Listener[] = [];
  snapshot: { component: T };

  constructor(private component: T) {
    this.snapshot = { component };
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
    this.snapshot = { component: this.component };
    this.listeners.forEach((listener) => listener());
  }
}

type Listener = () => void;
