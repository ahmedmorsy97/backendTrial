import Head from "next/head";
import React from "react";
import Layout from "../components/Layout";
import axios from "axios";
import "../styles/global.css";
import { PersonOutline } from "@material-ui/icons";

const Profile = (props) => {
  const [isUser, setIsUser] = React.useState(null);
  React.useEffect(() => {
    axios
      .get("/users/me", {
        withCredentials: true,
      })
      .then((user) => {
        // console.log(user);
        setIsUser(true);
      })
      .catch((err) => {
        const error = err?.response;
        const message = JSON.stringify(error?.data, undefined, 2);
        setIsUser(false);
      });
  }, []);
  return (
    <>
      <Head title="Profile" />
      <Layout>
        <h3>Profile</h3>
        {isUser === null ? (
          <></>
        ) : (
          <>
            {!isUser ? (
              <div className="noUser">
                <div className="svg">
                  <PersonOutline />
                </div>
                <h3>Please sign in to be able to view your profile !!</h3>
              </div>
            ) : (
              <></>
            )}
          </>
        )}
      </Layout>
    </>
  );
};

export default Profile;
