import React, { useCallback, useReducer } from "react";

import cacheReducer from "./cacheReducer";
import CacheContext from "./CacheContext";
import * as cacheType from "./cacheType";
const KeepAliveProvider = (props: any) => {
  // cacheStates 存放所有的缓存信息，dispatch 派发动作方法，可以通过派发动作修改缓存信息
  let [cacheStates, dispatch] = useReducer(cacheReducer, {});
  const mount = ({ cacheId, reactElement }: { cacheId: string; reactElement: any }) => {
    if (cacheStates[cacheId]) {
      let cacheState = cacheStates[cacheId];
      if (cacheState.status === cacheType.DESTROY) {
        let doms = cacheState.doms; // 获取到老的真实 DOM
        doms.forEach((dom: any) => dom.parentNode.removeChild(dom));
        dispatch({ type: cacheType.CREATE, payload: { cacheId, reactElement } }); // 创建缓存
      }
    } else {
      dispatch({ type: cacheType.CREATE, payload: { cacheId, reactElement } }); // 创建缓存
    }
  };

  let handleScroll = useCallback(
    (cacheId: any, event: any) => {
      if (cacheStates[cacheId]) {
        let target = event.target;
        let scrolls = cacheStates[cacheId].scrolls;
        scrolls[target] = target.scrollTop;
      }
    },
    [cacheStates]
  );
  return (
    <CacheContext.Provider value={{ cacheStates, dispatch, mount, handleScroll }}>
      {props.children}
      {Object.values(cacheStates)
        .filter((cacheState: any) => cacheState.status !== cacheType.DESTROY)
        .map(({ cacheId, reactElement }: any) => {
          return (
            <div
              id={`cache-${cacheId}`}
              key={cacheId}
              ref={
                // 如果给原生组件添加了 ref 那么当此真实 DOM 渲染到页之后会执行回调函数
                (divDOM) => {
                  let cacheState = cacheStates[cacheId];
                  if (divDOM && (!cacheState.doms || cacheState.status === cacheType.DESTROY)) {
                    let doms = Array.from(divDOM.childNodes);
                    dispatch({
                      type: cacheType.CREATED,
                      payload: {
                        cacheId,
                        doms,
                      },
                    });
                  }
                }
              }
            >
              {reactElement}
            </div> // divDOM 儿子们就是这个 reactElement 渲染出来的真实 DOM
          );
        })}
    </CacheContext.Provider>
  );
};

export default KeepAliveProvider;
