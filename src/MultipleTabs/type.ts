import { ReactNode, RefObject } from "react";

export interface IProps {
  activeName: string;
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
  activeName: string;
  include: string[];
  exclude?: string[];
  maxLen?: number;
}

export interface ComponentReactElement {
  children?: ReactNode | ReactNode[];
}
export interface IComponentProps extends ComponentReactElement {
  active: boolean;
  name: string;
  renderDiv: RefObject<HTMLDivElement>;
  scrolls: any;
  handleScroll: (path: string, event: any) => void;
}
