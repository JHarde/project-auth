import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { user } from "user";

const AUTH_URL = "https://modest-hamilton-9de3b4.netlify.app/authentication";

const Profile = () => {
  const [name, setName] = useState("");
  const accessToken = useSelector((store) => store.user.login.accessToken);
  const dispatch = useDispatch();

  const handleLogOut = () => {
    dispatch(user.actions.logOut());
  };
  console.log(accessToken);

  fetch(AUTH_URL, {
    method: "GET",
    headers: { Authorization: `${accessToken}` },
  })
    .then((response) => response.json())
    .then((json) => {
      setName(json.name);
    });

  return (
    <>
      <div>
        <h1>Welcome {name} you are logged in!</h1>
      </div>
      <button onClick={handleLogOut}>Log Out</button>
    </>
  );
};

export default Profile;
