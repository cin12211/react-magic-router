import queryString from "query-string";
import { useMemo } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  matchRoutes,
  NavigateOptions,
} from "react-router-dom";
import type { ExtractParams } from "../types";

type PublicRouterNavigator<
  T extends GlobalMagicRouter = GlobalMagicRouter,
  K extends keyof T = keyof T
> = K extends K
  ? {
      hash?: string;
      param?: ExtractParams<K extends string ? K : "">;
      path: K;
      query?: Partial<T[K]>;
    }
  : never;

export function useMagicRouter<P extends GlobalMagicRouter, K extends keyof P>(
  _?: K
) {
  const params = useParams();

  const location = useLocation();

  const query = useMemo(() => {
    const queryStringValue = location.search.split("?");

    const queryObject = queryString.parse(queryStringValue[1]);

    return queryObject as P[K];
  }, [location]);

  const navig = useNavigate();

  function getNavigatePath({ param, path, query }: PublicRouterNavigator) {
    let newPath = String(path);

    if (param) {
      for (const key in param as object) {
        newPath = newPath.replace(`:${key}`, param[key as keyof typeof param]);
      }
    }

    if (query) {
      const queryStringValue = queryString.stringify(query);

      newPath = `${newPath}?${queryStringValue}`;
    }

    return newPath;
  }

  function navigate(nav: PublicRouterNavigator, options?: NavigateOptions) {
    const newPath = getNavigatePath(nav);

    navig(newPath, options);
  }

  const isMatchRoutes = (paths: (keyof P)[]) => {
    const { pathname } = location;
    const routes = paths.map((path) => ({
      path,
    }));

    const isMatch = matchRoutes(routes as { path: string }[], pathname);

    return !!isMatch;
  };

  return {
    params: params as ExtractParams<K extends string ? K : "">,
    query,
    getNavigatePath,
    navigate,
    isMatchRoutes,
  };
}
