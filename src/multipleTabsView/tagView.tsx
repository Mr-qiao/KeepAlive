import React, { useContext } from "react";

import { Tabs } from "antd";
import { useNavigate } from "react-router";

import { useText } from "../MultipleTabs";

const TagView = () => {
  const { dropByCacheKey, cacheRouteList, activeName, setActiveName } = useText();
  const navigate = useNavigate();
  const hdEdit = (key: any) => {
    if (key) {
      dropByCacheKey(key);
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
