import { Button } from "antd";
import React, { useState } from "react";

const UserAdd = () => {
  let [number, setNumber] = useState(0);
  return (
    <div>
      用户名:
      <input />
      <Button onClick={() => setNumber((number) => number + 1)}>{number}</Button>
    </div>
  );
};

export default UserAdd;
