import { createInstance } from "localforage";

export const database = createInstance({
  name: "cube-world",
});
