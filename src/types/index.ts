import type { RouteObject } from "react-router-dom";

type Primitive = boolean | null | number | string | undefined;

export type DeepPartial<T> = T extends Primitive
  ? T
  : { [P in keyof T]?: DeepPartial<T[P]> };

export type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

export type IntersectionEachUnion<T, U> = T extends T
  ? U extends U
    ? T & U
    : never
  : never;

export type ExtractParams<T extends string> =
  T extends `${infer _}:${infer U}/${infer R}`
    ? ExtractParams<R> & Record<U, string>
    : T extends `${infer _}:${infer U}`
    ? Record<U, string>
    : Record<string, string>;

type QueryStringTemplateToUnion<T extends string> =
  T extends `${infer First}&${infer Rest}`
    ? First | QueryStringTemplateToUnion<Rest>
    : T;

export type ExtractQueryString<T extends string> = {
  [K in QueryStringTemplateToUnion<T> as K extends "" ? never : K]: string;
};

export type RemoveRedundantSlashes<S extends string> =
  S extends `//${infer Rest}`
    ? RemoveRedundantSlashes<`/${Rest}`>
    : S extends `${infer Start}//${infer Rest}`
    ? RemoveRedundantSlashes<`${Start}/${Rest}`>
    : S;

export type RouteObjectMagic = {
  children?: RouteObjectMagic[];
  query?: string;
} & DeepReadonly<Omit<RouteObject, "children">>;

// map route object only keep 'children' | 'path' | 'query' key
type MappedRouteMagic<
  T extends RouteObjectMagic,
  TR extends RouteObjectMagic = T
> = {
  [K in keyof TR as K extends "children" | "path" | "query"
    ? K
    : never]: K extends "children"
    ? MappedArrayRouteMagic<
        T["children"] extends RouteObjectMagic[] ? T["children"] : never
      >
    : K extends "query"
    ? ExtractQueryString<T["query"] extends string ? T["query"] : never>
    : K extends "path"
    ? T["path"]
    : never;
};

// map for array route
type MappedArrayRouteMagic<T extends RouteObjectMagic[]> = T extends [
  infer First,
  ...infer Rest
]
  ? [
      MappedRouteMagic<First extends RouteObjectMagic ? First : never>,
      ...MappedArrayRouteMagic<Rest extends RouteObjectMagic[] ? Rest : never>
    ]
  : [];

type RouterMapped = {
  children?: RouterMapped[];
  path: string;
  query?: Record<string, string>;
};

type FlattenRouterMapped<
  T extends RouterMapped,
  P extends string = "",
  HaveChildren extends boolean = false
> = T["children"] extends RouterMapped[]
  ?
      | [RemoveRedundantSlashes<`${P}/${T["path"]}`>, T["query"], true]
      | FlattenArrayRouterMapped<
          T["children"],
          `${P}/${T["path"]}`,
          HaveChildren
        >[number]
  : [RemoveRedundantSlashes<`${P}/${T["path"]}`>, T["query"], HaveChildren];

type FlattenArrayRouterMapped<
  T extends RouterMapped[],
  P extends string = "",
  HaveChildren extends boolean = false
> = T extends [infer First, ...infer Rest]
  ? [
      FlattenRouterMapped<
        First extends RouterMapped ? First : never,
        P,
        HaveChildren
      >,
      ...FlattenArrayRouterMapped<
        Rest extends RouterMapped[] ? Rest : never,
        P,
        HaveChildren
      >
    ]
  : [];

type UnionToIntersection<U> = (
  U extends unknown ? (x: U) => void : never
) extends (x: infer R) => void
  ? R
  : never;

type FlattenUnion<T> = UnionToIntersection<
  T extends [infer K, infer V, infer HaveChildren]
    ? {
        [KK in K & string as KK extends string
          ? HaveChildren extends false
            ? KK
            : never
          : never]: V;
      }
    : never
>;

export type MappedGlobalRouter<T extends RouteObjectMagic[]> = FlattenUnion<
  FlattenArrayRouterMapped<MappedArrayRouteMagic<T>>[number]
>;
