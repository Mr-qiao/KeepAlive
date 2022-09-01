import React, { useContext } from "react";

import CacheContext from "./CacheContext";
import { IKeepalive } from "./KeepAlive";

export const useText = (): {
  cacheRouteList: IKeepalive[];
  activeName: string;
  setActiveName: any;
  dropByCacheKey: (path: string) => void;
} => {
  const { dropByCacheKey, cacheRouteList, activeName, setActiveName } = useContext(CacheContext);
  return {
    dropByCacheKey,
    cacheRouteList,
    activeName,
    setActiveName,
  };
};
