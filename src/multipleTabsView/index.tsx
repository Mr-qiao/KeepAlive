import React, { useContext, useEffect, useRef, useState } from "react";

import { Route, Routes, Link, BrowserRouter } from "react-router-dom";
import { KeepAlive } from "../MultipleTabs";

import Home from "../components/Home";
import UserList from "../components/UserList";
import UserAdd from "../components/UserAdd";
import TagView from "./tagView";

const LeftNav = [
  {
    name: "首页",
    link: "/",
  },
  {
    name: "用户列表",
    link: "/list",
  },
  {
    name: "添加用户",
    link: "/add",
  },

  {
    name: "添加用户1",
    link: "/add1",
  },

  {
    name: "添加用户2",
    link: "/add2",
  },

  {
    name: "添加用户3",
    link: "/add3",
  },

  {
    name: "添加用户4",
    link: "/add4",
  },

  {
    name: "添加用户5",
    link: "/add5",
  },
];
const Layout = () => {
  return (
    <KeepAlive keepalive={LeftNav}>
      <TagView />
      <ul>
        {LeftNav.map((item, index) => {
          return (
            <li key={index}>
              <Link to={item.link}>{item.name}</Link>
            </li>
          );
        })}
      </ul>
    </KeepAlive>
  );
};
function KeepView() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="list" element={<UserList />} />
          <Route path="add" element={<UserAdd />} />
          <Route path="add1" element={<UserAdd />} />
          <Route path="add2" element={<UserAdd />} />
          <Route path="add3" element={<UserAdd />} />
          <Route path="add4" element={<UserAdd />} />
          <Route path="add5" element={<UserAdd />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default KeepView;
