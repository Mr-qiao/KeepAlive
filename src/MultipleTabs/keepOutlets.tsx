import { memo, useCallback, useEffect, useRef, useState } from "react";
import type { RefObject, ReactNode } from "react";

import { createPortal, render } from "react-dom";
import { matchPath, useLocation, useOutlet, useRoutes } from "react-router-dom";

import { IKeepalive } from "./KeepAlive";

function isKeepPath(aliveList: IKeepalive[], path: string) {
  let isKeep = false;
  aliveList?.map((item) => {
    if (item.link === path) {
      isKeep = true;
    }
    // if (item.link instanceof RegExp && item.link.test(path)) {
    //   isKeep = true;
    // }
    if (typeof item.link === "string" && item.link.toLowerCase() === path) {
      isKeep = true;
    }
  });
  return isKeep;
}
export interface ComponentReactElement {
  children?: ReactNode | ReactNode[];
}
interface ComponentProps extends ComponentReactElement {
  active: boolean;
  name: string;
  renderDiv: RefObject<HTMLDivElement>;
  scrolls: any;
  handleScroll: (path: string, event: any) => void;
}
interface IProps {
  keepalive: IKeepalive[];
  keepElements: any;
}
function Component({ active, children, name, renderDiv, handleScroll, scrolls }: ComponentProps) {
  const [targetElement] = useState(() => document.createElement("div"));
  const activatedRef = useRef(false);
  activatedRef.current = activatedRef.current || active;
  useEffect(() => {
    let onScroll = handleScroll.bind(null, location.pathname);
    if (active) {
      renderDiv.current?.appendChild(targetElement);
      targetElement.childNodes.forEach((dom: any) => (dom.scrollTop = scrolls[dom]));
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

export const KeepOutlets = memo(function KeepOutlets(props: IProps) {
  const { keepalive, keepElements } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  // 是否需要缓存
  const isKeep = isKeepPath(keepalive, location.pathname);
  const element = useOutlet();
  if (isKeep) {
    let obj = {
      element,
      scrolls: keepElements.current[location.pathname]?.scrolls || {},
    };
    keepElements.current[location.pathname] = obj;
  }

  let handleScroll = useCallback(
    (path: any, event: any) => {
      if (keepElements.current[path]) {
        let target = event.target;
        let scrolls = keepElements.current[path].scrolls;
        scrolls[target] = target.scrollTop;
      }
    },
    [element]
  );
  return (
    <>
      <div ref={containerRef} className="keep-alive" />
      {Object.entries(keepElements?.current)?.map(([pathname, ele]: any) => (
        <Component
          scrolls={ele.scrolls}
          renderDiv={containerRef}
          name={pathname}
          key={pathname}
          active={pathname === location.pathname}
          handleScroll={handleScroll}
        >
          {ele.element}
        </Component>
      ))}
    </>
  );
});
