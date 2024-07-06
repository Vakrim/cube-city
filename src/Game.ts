export interface GameComponent {
  init?(): void;
  update?(deltaTime: number): void;
}

export interface GameComponentConstructor<
  T extends GameComponent = GameComponent
> {
  new (game: Game): T;
}

export class Game {
  components = new Map<string, GameComponent>();

  addComponent(component: GameComponentConstructor) {
    if (this.components.has(component.name)) {
      throw new Error(`Component ${component.name} already added`);
    }

    this.components.set(component.name, new component(this));
  }

  getComponent<T extends GameComponent>(
    componentConstructor: GameComponentConstructor<T>
  ) {
    const component = this.components.get(componentConstructor.name);

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
