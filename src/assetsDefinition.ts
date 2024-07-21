export const assetsDefinition = {
  models: {
    woodenSupport: "wooden-support",
  },
};

type AssetsDefinition = typeof assetsDefinition;

export type ModelName = keyof AssetsDefinition["models"];
