import { ReactNode, RefObject } from "react";

export interface IProps {
  className?: string;
  include?: string[];
  exclude?: string[];
  maxLen?: number;
}
export interface IKeepElementRef {
  element: any;
  scrolls: any;
  isKeep: boolean;
}

export interface IContext {
  dropByCacheKey: any;
  keepElements: any;
  className?: string;
  include: string[];
  exclude: string[];
  maxLen?: number;
}

export interface ComponentReactElement {
  children?: ReactNode | ReactNode[];
}
export interface IComponentProps extends ComponentReactElement {
  className: string;
  active: boolean;
  name: string;
  renderDiv: RefObject<HTMLDivElement>;
  scrolls: any;
  handleScroll: (path: string, event: any) => void;
}
