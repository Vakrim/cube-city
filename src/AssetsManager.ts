import { BufferGeometry, Group, LoadingManager, Material, Mesh } from "three";
import { MTLLoader, OBJLoader } from "three/examples/jsm/Addons.js";
import { assetsDefinition, ModelName } from "./assetsDefinition";
import { AssetsPack } from "./AssetsPack";

class AssetsManager {
  models: Record<ModelName, string>;
  loadingManger: LoadingManager;
  objLoader: OBJLoader;
  mtlLoader: MTLLoader;

  constructor({ models }: { models: Record<ModelName, string> }) {
    this.models = models;

    this.loadingManger = new LoadingManager();

    this.loadingManger.setURLModifier((url) => this.loadModelFile(url));
    this.objLoader = new OBJLoader(this.loadingManger);
    this.mtlLoader = new MTLLoader(this.loadingManger);
  }

  async load(): Promise<AssetsPack> {
    const models = await Promise.all(
      Object.keys(this.models).map((model) =>
        this.loadModel(model as ModelName).then((group) => {
          const mesh = only(group.children);

          if (!(mesh instanceof Mesh)) {
            throw new Error("Expected a mesh");
          }

          if (!(mesh.geometry instanceof BufferGeometry)) {
            throw new Error("Expected a BufferGeometry");
          }

          if (!(mesh.material instanceof Material)) {
            throw new Error("Expected a Material");
          }

          return [
            model as ModelName,
            { geometry: mesh.geometry, material: mesh.material },
          ];
        }),
      ),
    );

    return new AssetsPack(
      Object.fromEntries(models) as Record<
        ModelName,
        { geometry: BufferGeometry; material: Material }
      >,
    );
  }

  private loadModelFile(modelFile: string) {
    // handle texture file referenced in mtl file
    if (modelFile.startsWith("./") && modelFile.endsWith(".png")) {
      modelFile = modelFile.slice(2);
    }

    return new URL(`./assets/models/${modelFile}`, import.meta.url).href;
  }

  private loadModel(model: ModelName) {
    return new Promise<Group>((resolve, reject) => {
      this.mtlLoader.load(`${this.models[model]}.mtl`, (materials) => {
        materials.preload();
        this.objLoader
          .setMaterials(materials)
          .load(`${this.models[model]}.obj`, resolve, undefined, reject);
      });
    });
  }
}

export const assetsManager = new AssetsManager(assetsDefinition);

function only<T>(value: T[]): T {
  if (value.length !== 1) {
    throw new Error("Expected exactly one element");
  }

  return value[0];
}
