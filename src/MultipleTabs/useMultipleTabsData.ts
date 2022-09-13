import React, { useContext } from "react";

import CacheContext from "./CacheContext";

export const useMultipletabsData = (): {
  dropByCacheKey: (path: string) => void;
} => {
  const { dropByCacheKey } = useContext(CacheContext);
  return {
    dropByCacheKey,
  };
};
