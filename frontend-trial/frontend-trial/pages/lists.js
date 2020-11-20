import Head from "next/head";
import React from "react";
import Layout from "../components/Layout";
import axios from "axios";
import "../styles/global.css";
import { Dns } from "@material-ui/icons";

const Lists = (props) => {
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
        const error = err.response;
        const message = JSON.stringify(error.data, undefined, 2);
        setIsUser(false);
      });
  }, []);
  return (
    <>
      <Head title="Lists" />
      <Layout>
        <h3>Lists</h3>
        {isUser === null ? (
          <></>
        ) : (
          <>
            {!isUser ? (
              <div className="noUser">
                <div className="svg">
                  <Dns />
                </div>
                <h3>
                  Please sign in to be able to join your favorate place' waiting
                  list !!
                </h3>
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

export default Lists;
