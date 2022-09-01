import React, { ReactElement, useContext, useEffect } from "react";
import CacheContext from "./CacheContext";
import * as cacheTypes from "./cacheType";

const WithKeepAlive = (
  OldComponent: any,
  { cacheId = window.location.pathname, scroll }: { cacheId: string; scroll?: boolean }
) => {
  return function (props: any) {
    const { cacheStates, dispatch, mount, handleScroll } = useContext(CacheContext);
    const divRef = React.useRef(null as any);
    useEffect(() => {
      if (scroll) {
        divRef.current.addEventListener("scroll", handleScroll.bind(null, cacheId), true); // 监听捕获阶段
      }
      return;
    }, [handleScroll]);
    useEffect(() => {
      let cacheState = cacheStates[cacheId];
      // 如果真实 DOM 已经 ok 了
      if (cacheState && cacheState.doms && cacheState.status !== cacheTypes.DESTROY) {
        let doms = cacheState.doms;
        doms.forEach((dom: any) => divRef.current.appendChild(dom));
        if (scroll) {
          doms.forEach((dom: any) => {
            if (cacheState.scrolls[dom]) {
              console.log(dom);
              dom.scrollTop = cacheState.scrolls[dom];
            }
          });
        }
      } else {
        // 真实 DOM 还没有生成
        mount({
          cacheId,
          reactElement: <OldComponent {...props} dispatch={dispatch} />,
        });
      }
    }, [cacheStates, mount, props, dispatch]);
    return (
      <div id={`withKeepAlive_${cacheId}`} ref={divRef}>
        {/**
         * 此处需要一个 OldComponent 渲染出来的真实 DOM
         */}
      </div>
    );
  };
};

export default WithKeepAlive;

/**
 * 本组建的核心思路
 * 我们要通过缓存容器去创建 OldComponents 对应的真实 DOM 并且进行缓存
 * 即使这个 OldComponents  被销毁了 缓存还可以保留
 * 以后这个 OldComponents 再次渲染的时候，可以复用上次的缓存就可以了
 *
 */
