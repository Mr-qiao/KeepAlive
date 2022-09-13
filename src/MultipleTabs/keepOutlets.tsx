import { memo, useCallback, useContext, useEffect, useRef, useState } from "react";

import { createPortal } from "react-dom";
import { Outlet, useLocation, useOutlet } from "react-router-dom";
import CacheContext from "./CacheContext";

import { IComponentProps } from "./type";

function isKeepPath(include: string[], path: string) {
  let isKeep = false;
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
  return isKeep;
}
function Component({ active, children, name, renderDiv, handleScroll, scrolls }: IComponentProps) {
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
  }, [name, targetElement]);
  return <>{activatedRef.current && createPortal(children, targetElement)}</>;
}

export const KeepOutlets = memo(function KeepOutlets() {
  const { activeName, include, keepElements } = useContext(CacheContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  // 是否需要缓存
  const isKeep = isKeepPath(include, location.pathname);
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
      <div ref={containerRef} className="keep-alive" />
      {Object.entries(keepElements?.current)?.map(([pathname, ele]: any) => {
        return (
          <Component
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
