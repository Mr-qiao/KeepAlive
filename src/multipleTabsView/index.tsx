import React, { useContext, useEffect, useRef, useState } from "react";

import { Route, Routes, Link, BrowserRouter, Outlet } from "react-router-dom";
import { KeepAlive } from "../MultipleTabs";

import Home from "../components/Home";
import UserList from "../components/UserList";
import UserAdd from "../components/UserAdd";
import TagView from "./tagView";
import UserAdd1 from "../components/UserAdd1";
import UserAdd2 from "../components/UserAdd2";
import UserAdd3 from "../components/UserAdd3";
import UserAdd4 from "../components/UserAdd4";
import UserAdd5 from "../components/UserAdd5";
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
    <KeepAlive>
      <TagView leftNav={LeftNav} />
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
          <Route path="add1" element={<UserAdd1 />} />
          <Route path="add2" element={<UserAdd2 />} />
          <Route path="add3" element={<UserAdd3 />} />
          <Route path="add4" element={<UserAdd4 />} />
          <Route path="add5" element={<UserAdd5 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default KeepView;
