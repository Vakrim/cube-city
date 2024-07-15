export class ReactStore {
  private listeners: (() => void)[] = [];

  subscribe(onStoreChange: () => void): () => void {
    this.listeners.push(onStoreChange);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== onStoreChange);
    };
  }

  notify() {
    this.listeners.forEach((listener) => listener());
  }
}
