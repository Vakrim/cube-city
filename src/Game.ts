export interface GameComponent {
  init?(): void;
  update?(deltaTime: number): void;
}

export interface GameComponentConstructor<
  T extends GameComponent = GameComponent
> {
  new (game: Game): T;
}

interface AnyClass<T> {
  new (...args: any[]): T;
}

export class Game {
  components = new Map<unknown, GameComponent>();
  instances = new Map<unknown, unknown>();

  createComponent(componentConstructor: GameComponentConstructor) {
    if (this.components.has(componentConstructor)) {
      throw new Error(`Component ${componentConstructor.name} already added`);
    }

    this.components.set(componentConstructor, new componentConstructor(this));
  }

  addComponentInstance<T extends { new (...args: unknown[]): InstanceType<T> }>(
    constructor: T,
    instance: InstanceType<T>
  ) {
    if (this.components.has(constructor)) {
      throw new Error(`Component ${constructor.name} already added`);
    }

    this.instances.set(constructor, instance);
  }

  getComponent<T>(
    componentConstructor: AnyClass<T>
  ) {
    const component =
      this.components.get(componentConstructor) ??
      this.instances.get(componentConstructor);

    if (!component) {
      throw new Error(`Component ${componentConstructor.name} not found`);
    }

    return component as T;
  }

  init() {
    this.components.forEach((component) => component.init?.());
  }

  update(deltaTime: number) {
    this.components.forEach((component) => component.update?.(deltaTime));
  }
}
