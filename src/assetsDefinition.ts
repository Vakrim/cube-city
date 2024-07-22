export const assetsDefinition = {
  models: {
    woodenSupport: "wooden-support",
    woodenStairs: "wooden-stairs",
  },
};

type AssetsDefinition = typeof assetsDefinition;

export type ModelName = keyof AssetsDefinition["models"];
