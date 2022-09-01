import React from "react";
import { Link } from "react-router-dom";

const UserList = () => {
  let users = new Array(100).fill(0);
  return (
    <ul style={{ height: "200px", overflow: "scroll" }}>
      {users.map((item, index) => {
        return (
          <li key={index}>
            <Link to="/add">{index}</Link>
          </li>
        );
      })}
    </ul>
  );
};

export default UserList;
