import React from "react";

import { IKeepalive } from "./KeepAlive";

interface IContext {
  dropByCacheKey: any;
  keepElements: any;
  keepalive: IKeepalive[];
  cacheRouteList: IKeepalive[];
  activeName: string;
  setActiveName: any;
}
let CacheContext = React.createContext({} as IContext);

export default CacheContext;
