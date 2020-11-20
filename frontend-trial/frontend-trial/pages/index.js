import React from "react";
import Head from "../components/head";
import Layout from "../components/Layout";
import axios from "axios";
import Place from "../components/place";

import "../styles/global.css";

const Home = (props) => {
  const [isUser, setIsUser] = React.useState(null);
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    axios
      .get("/users/me", {
        withCredentials: true,
      })
      .then((res) => {
        // console.log(res);
        setUser(res.data);
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
      <Head title="Home" />
      <Layout>
        <h2>Places</h2>
        <div className="placesHolder">
          {props?.places.length > 0 ? (
            props.places.map((place, index) => (
              <Place data={place} key={index} user={user} setUser={setUser} />
            ))
          ) : (
            <p>No Places to be viewed !!!</p>
          )}
        </div>
      </Layout>
    </>
  );
};

export async function getServerSideProps(params) {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://damp-waters-55084.herokuapp.com/api"
      : "http://localhost:5000/api";
  const res = await axios.get(baseUrl + "/places/readAll", {
    page: 1,
    limit: 10,
  });

  const data = await res.data;
  return {
    props: {
      places: Array.isArray(data.places) ? data.places : [],
      pages: data.pages ? data.pages : 1,
    },
  };
}
export default Home;
