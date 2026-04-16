import React, { useContext } from "react";
import { UserContext } from "../hooks/Context";

export default function JobTrackForm() {
  const user = useContext(UserContext);

  return (
    <div>
      <h1>Welcome User:</h1>
      <p>
        Name: {user.name} id: {user.id}
      </p>
    </div>
  );
}
