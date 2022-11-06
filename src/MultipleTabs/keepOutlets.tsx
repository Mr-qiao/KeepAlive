import { isEmpty } from "ramda";
import { memo, useCallback, useContext, useEffect, useRef, useState } from "react";

import { createPortal } from "react-dom";
import { Outlet, useLocation, useOutlet } from "react-router-dom";
import CacheContext from "./CacheContext";

import { IComponentProps } from "./type";
/**
 * 缓存组件状态
 * @param include 需要缓存的路由 例子：['/home', '/user/*']
 * @param exclude  不需要缓存的路由
 * @param path 当前路由
 * @returns
 */
function isKeepPath(include: string[], exclude: string[], path: string) {
  let isKeep = false;
  if (isEmpty(include) && isEmpty(exclude)) return true;
  if (!isEmpty(include)) {
    include?.some((item) => {
      if (item.split("/*").length === 1 && item === path) {
        isKeep = true;
      } else if (item.split("/*").length > 1) {
        isKeep = item.split("/*").every((m) => {
          return path.includes(m);
        });
      }
      return isKeep;
    });
  }
  if (!isEmpty(exclude)) {
    if (exclude.includes(path)) return false;
  }
  isKeep = true;
  return isKeep;
}

/**
 *
 * @param
 * @returns
 */
function Component({ className, active, children, name, renderDiv, handleScroll, scrolls }: IComponentProps) {
  const [targetElement] = useState(() => document.createElement("div"));
  const activatedRef = useRef(false);
  activatedRef.current = activatedRef.current || active;
  useEffect(() => {
    const onScroll = handleScroll.bind(null, location.pathname);
    if (active) {
      renderDiv.current?.appendChild(targetElement);
      targetElement.childNodes.forEach((dom: any) => (dom.scrollTop = scrolls?.[dom]));
      targetElement.addEventListener("scroll", onScroll, true); // 监听捕获阶段
    } else {
      try {
        renderDiv.current?.removeChild(targetElement);
        targetElement.removeEventListener("scroll", onScroll);
      } catch (e) {}
    }
    return () => {
      targetElement.removeEventListener("scroll", onScroll);
    };
  }, [active, name, renderDiv, targetElement, handleScroll]);
  useEffect(() => {
    targetElement.setAttribute("id", name);
    targetElement.setAttribute("class", className);
  }, [name, targetElement]);
  return <>{activatedRef.current && createPortal(children, targetElement)}</>;
}

export const KeepOutlets = memo(function KeepOutlets() {
  const { className, include, exclude, keepElements } = useContext(CacheContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  // 是否需要缓存
  const isKeep = isKeepPath(include, exclude, location.pathname);
  console.log("isKeep", isKeep);
  const element = useOutlet();
  const obj = {
    element,
    isKeep,
    scrolls: keepElements.current[location.pathname]?.scrolls || {},
  };
  keepElements.current[location.pathname] = obj;

  const handleScroll = useCallback(
    (path: any, event: any) => {
      if (keepElements.current[path]) {
        const target = event.target;
        const scrolls = keepElements.current[path].scrolls;
        scrolls[target] = target.scrollTop;
      }
    },
    [element]
  );
  return (
    <>
      <div ref={containerRef} className={`"keep-alive",${className}`} />
      {Object.entries(keepElements?.current)?.map(([pathname, ele]: any) => {
        return (
          <Component
            className={className || ""}
            scrolls={isKeep ? ele.scrolls : {}}
            renderDiv={containerRef}
            name={pathname}
            key={pathname}
            active={pathname === location.pathname}
            handleScroll={handleScroll}
          >
            {ele.isKeep ? ele.element : <Outlet />}
          </Component>
        );
      })}
    </>
  );
});
