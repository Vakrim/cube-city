import { BufferGeometry, Material } from "three";
import { ModelName } from "./assetsDefinition";

export class AssetsPack {
  constructor(
    public readonly models: Record<
      ModelName,
      { geometry: BufferGeometry; material: Material }
    >,
  ) {}
}
