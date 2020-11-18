import Header from "./Header";
import Footer from "./Footer";
import BottomNav from "./bottomNav";

import Router from "next/router";
import NProgress from "nprogress"; //nprogress module
import "nprogress/nprogress.css"; //styles of nprogress
import "../styles/main.css";
import axios from "axios";

//Binding events.
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const Layout = (props) => {
  axios.defaults.baseURL =
    process.env.NODE_ENV === "production"
      ? "https://damp-waters-55084.herokuapp.com/api"
      : "http://localhost:5000/api";
  return (
    <>
      <Header />
      <div
        className="mainHolder"
        style={{
          textAlign: "center",
          fontSize: "25px",
          fontWeight: "bold",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {props.children}
      </div>
      <BottomNav />
      {/* <Footer /> */}
      <style jsx global>{`
        body {
          margin: 0;
          font-family: "Lato", sans-serif;
        }
        input,
        input:focus,
        select,
        select:focus,
        a,
        a:focus,
        div,
        div:focus,
        button,
        button:focus,
        fieldset,
        fieldset:focus,
        textarea,
        textarea:focus {
          outline: none;
        }
        .mainHolder {
          width: 90%;
          margin: auto;
        }
        button {
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default Layout;
