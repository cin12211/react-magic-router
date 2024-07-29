import { MappedGlobalRouter, RouteObjectMagic } from "./types";

export * from "./types";
export * from "./hooks";

export const routes = [] as const satisfies RouteObjectMagic[];

declare global {
  type GlobalMagicRouter = MappedGlobalRouter<typeof routes>;
}
