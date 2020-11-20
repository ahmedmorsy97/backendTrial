import Head from "next/head";
import React from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { FavoriteBorder } from "@material-ui/icons";
import "../styles/global.css";
import Place from "../components/place";

const Favorites = (props) => {
  const [isUser, setIsUser] = React.useState(null);
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    axios
      .get("/users/me", {
        withCredentials: true,
      })
      .then((user) => {
        setUser(user.data);
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
      <Head title="Favorites" />
      <Layout>
        <h3>Favorites</h3>
        {isUser === null ? (
          <></>
        ) : (
          <>
            {!isUser ? (
              <div className="noUser">
                <div className="svg">
                  <FavoriteBorder />
                </div>
                <h3>
                  Please sign in to be able to see your favorate places !!
                </h3>
              </div>
            ) : (
              <>
                {user?.favoratePlaces?.length === 0 ? (
                  <div className="noUser">
                    <div className="svg">
                      <FavoriteBorder />
                    </div>
                    <h3>It is the timr to choose your favorate places !!</h3>
                  </div>
                ) : (
                  <div className="placesHolder">
                    {user?.favoratePlaces?.map((place, index) => (
                      <Place
                        data={place}
                        key={index}
                        user={user}
                        setUser={setUser}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </Layout>
    </>
  );
};

export default Favorites;
