export interface GameComponent {
  init?(): void;
  update?(deltaTime: number): void;
  afterUpdate?(deltaTime: number): void;
}

export interface GameComponentConstructor<
  T extends GameComponent = GameComponent,
> {
  new (game: Game): T;
}

interface AnyClass<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): T;
}

export class Game {
  components = new Map<string, GameComponent>();
  instances = new Map<string, unknown>();

  createComponent<T extends GameComponent>(
    componentConstructor: GameComponentConstructor<T>,
    name?: string,
  ): T {
    const componentName = name ?? componentConstructor.name;

    if (this.components.has(componentName)) {
      throw new Error(`Component "${componentName}" already added`);
    }

    const component = new componentConstructor(this);

    this.components.set(componentName, component);

    return component;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addComponentInstance<T extends { new (...args: any[]): InstanceType<T> }>(
    constructorOrName: T | string,
    instance: InstanceType<T>,
  ) {
    const componentName =
      typeof constructorOrName === "string"
        ? constructorOrName
        : constructorOrName.name;

    if (this.components.has(componentName)) {
      throw new Error(`Component "${componentName}" already added`);
    }

    this.instances.set(componentName, instance);
  }

  get<T>(componentConstructor: AnyClass<T> | string): T {
    const componentName =
      typeof componentConstructor === "string"
        ? componentConstructor
        : componentConstructor.name;

    const component =
      this.components.get(componentName) ?? this.instances.get(componentName);

    if (!component) {
      throw new Error(`Component "${componentName}" not found`);
    }

    return component as T;
  }

  init() {
    this.components.forEach((component) => component.init?.());
  }

  update(deltaTime: number) {
    this.components.forEach((component) => component.update?.(deltaTime));

    this.components.forEach((component) => component.afterUpdate?.(deltaTime));
  }
}
