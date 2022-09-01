import React, { useEffect, useRef, useState } from "react";

import { useLocation, useNavigate } from "react-router";

import CacheContext from "./CacheContext";
import { KeepOutlets } from "./keepOutlets";

export interface IKeepalive {
  link: string;
  name: string;
}
interface IProps {
  keepalive: IKeepalive[];
}
interface IKeepElementRef {
  element: any;
  scrolls: any;
}

const KeepAlive = (props: React.PropsWithChildren<IProps>) => {
  const { keepalive } = props;
  const keepElements = useRef<{ string: IKeepElementRef }>({} as { string: IKeepElementRef });
  const location = useLocation();
  const navigate = useNavigate();

  const [cacheRouteList, setCacheRouteList] = useState<IKeepalive[]>([]); // 页签列表
  const [activeName, setActiveName] = useState<string>(""); // 当前选中

  // 添加页签
  useEffect(() => {
    const index = cacheRouteList.findIndex((item) => {
      return item.link === location.pathname;
    });
    if (~index) return;
    setCacheRouteList((origin) => {
      return [...origin, ...keepalive.filter((item) => item.link === location.pathname)];
    });
    setActiveName(location.pathname);
  }, [location]);

  // 清楚缓存
  function dropByCacheKey(path: string) {
    const len = cacheRouteList.length;
    (keepElements.current as any)[path] = {} as IKeepElementRef;
    setCacheRouteList((origin) => {
      return origin.filter((item) => item.link !== path);
    });
    if (path !== location.pathname) return;
    const index = cacheRouteList.findIndex((item) => {
      return item.link === path;
    });
    let key = "/";
    if (index === len - 1 && len !== 1) {
      key = cacheRouteList[index - 1].link;
    } else if (len === 1) {
      key = "/";
    } else {
      key = cacheRouteList[index + 1].link;
    }
    navigate({ pathname: key });
  }

  return (
    <CacheContext.Provider
      value={{ keepalive, keepElements, dropByCacheKey, cacheRouteList, activeName, setActiveName }}
    >
      {props.children}
      <KeepOutlets keepElements={keepElements} keepalive={keepalive} />
    </CacheContext.Provider>
  );
};

export default KeepAlive;
