import Link from "next/link";
import React from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/router";

const links = [
  { href: "/sign-in", label: "Sign In" },
  { href: "/sign-up", label: "Sign Up" },
].map((link) => {
  link.key = `nav-link-${link.href}-${link.label}`;
  return link;
});

const Nav = (props) => {
  const router = useRouter();
  const cookie = Cookies.get("userId");
  // console.log(cookie);

  const signOut = () => {
    axios
      .post(
        "/users/logout",
        {},
        {
          withCredentials: true,
          headers: {
            "x-auth": cookie,
          },
        }
      )
      .then((res) => {
        Cookies.remove("userId");
        router.push("/sign-in");
        console.log(res.data);
      })
      .catch((err) => {
        console.log("Error is ", err);
      });
  };
  return (
    <nav>
      <ul>
        <li>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>
        <ul>
          {!cookie ? (
            links.map(({ key, href, label }) => (
              <li key={key}>
                <Link href={href}>
                  <a>{label}</a>
                </Link>
              </li>
            ))
          ) : (
            <li>
              <a onClick={() => signOut()} style={{ cursor: "pointer" }}>
                {"Sign Out"}
              </a>
            </li>
          )}
        </ul>
      </ul>

      <style jsx>{`
        :global(body) {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
            Helvetica, sans-serif;
        }
        nav {
          text-align: center;
        }
        ul {
          display: flex;
          justify-content: space-between;
        }
        nav > ul {
          padding: 4px 16px;
        }
        li {
          display: flex;
          padding: 6px 8px;
        }
        a {
          color: #067df7;
          text-decoration: none;
          font-size: 13px;
        }
      `}</style>
    </nav>
  );
};

Nav.getInitialProps = async (context) => {
  // const { store, isServer, query, req } = context;
  return {
    props: {
      context,
    },
  };
};

export default Nav;
