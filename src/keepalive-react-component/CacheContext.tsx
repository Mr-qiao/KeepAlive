import React from "react";

interface IContext {
  cacheStates: any;
  dispatch: any;
  mount: any;
  handleScroll: any;
}
let CacheContext = React.createContext({} as IContext);

export default CacheContext;
