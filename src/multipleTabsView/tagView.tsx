import React, { useContext, useEffect, useState } from "react";

import { Tabs } from "antd";
import { useLocation, useNavigate } from "react-router";

import { useMultipletabsData } from "./../MultipleTabs";

export interface IKeepalive {
  link: string;
  name: string;
}
const TagView = ({ leftNav }: { leftNav: IKeepalive[] }) => {
  const { dropByCacheKey } = useMultipletabsData();
  const [cacheRouteList, setCacheRouteList] = useState<IKeepalive[]>([]); // 页签列表
  const [activeName, setActiveName] = useState<string>(""); // 当前选中
  const navigate = useNavigate();
  const location = useLocation();

  // 添加页签
  useEffect(() => {
    const index = cacheRouteList.findIndex((item) => {
      return item.link === location.pathname;
    });
    if (~index) return;
    setCacheRouteList((origin) => {
      return [...origin, ...leftNav.filter((item) => item.link === location.pathname)];
    });
    setActiveName(location.pathname);
  }, [location]);

  const hdEdit = (path: any) => {
    if (path) {
      const len = cacheRouteList.length;
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
      dropByCacheKey(path);
    }
  };

  const hdChange = (key: string) => {
    setActiveName(key);
    navigate({ pathname: key });
  };
  return (
    <Tabs
      type="editable-card"
      onChange={hdChange}
      className="tagsView-tabs"
      hideAdd
      activeKey={activeName}
      onEdit={hdEdit}
    >
      {cacheRouteList.map((item, index) => {
        return <Tabs.TabPane tab={item.name} key={item.link} />;
      })}
    </Tabs>
  );
};

export default TagView;
