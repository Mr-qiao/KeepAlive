import React, { useState } from "react";
import { Route, Routes, Link, BrowserRouter, Outlet, useOutlet } from "react-router-dom";
import { KeepAliveProvider, WithKeepAlive } from "./../keepalive-react-component";

import Home from "./../components/Home";
import UserList from "./../components/UserList";
import UserAdd from "./../components/UserAdd";

let KeepAliveHome = WithKeepAlive(Home, { cacheId: "Home" });

let KeepAliveUserList = WithKeepAlive(UserList, { cacheId: "UserList", scroll: true });

let KeepAliveUserAdd = WithKeepAlive(UserAdd, { cacheId: "UserAdd" });

function KeepView() {
  return (
    <BrowserRouter>
      <KeepAliveProvider>
        <ul>
          <li>
            <Link to="/">首页</Link>
          </li>
          <li>
            <Link to="/list">用户列表</Link>
          </li>
          <li>
            <Link to="/add">添加用户</Link>
          </li>
        </ul>
        <Routes>
          <Route path="/" element={<KeepAliveHome />} />
          <Route path="list" element={<KeepAliveUserList />} />
          <Route path="add" element={<KeepAliveUserAdd />} />
        </Routes>
        <Outlet />
      </KeepAliveProvider>
    </BrowserRouter>
  );
}

export default KeepView;
