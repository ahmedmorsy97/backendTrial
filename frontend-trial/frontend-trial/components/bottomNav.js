import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { AccountCircle, Restaurant, List } from "@material-ui/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import "../styles/bottomNav.css";

const useStyles = makeStyles({
  root: {
    width: 500,
  },
});

const BottomNav = (props) => {
  const router = useRouter();
  const classes = useStyles();
  let page = "";
  switch (router.pathname) {
    case "/":
      page = "resturants";
      break;
    case "/favorites":
      page = "favorites";
      break;
    case "/profile":
      page = "profile";
      break;
    case "/lists":
      page = "lists";
      break;

    default:
      page = "";
      break;
  }

  const [value, setValue] = React.useState(page);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const checkValue = (val) => {
    return val === value;
  };

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      className={classes.root + " fixedBottom"}
    >
      <Link href="/">
        <BottomNavigationAction
          label="Resturants"
          value="resturants"
          icon={<Restaurant />}
          showLabel={checkValue("resturants")}
          className={checkValue("resturants") ? "Mui-selected" : ""}
        />
      </Link>
      <Link href="/favorites">
        <BottomNavigationAction
          label="Favorites"
          value="favorites"
          icon={<FavoriteIcon />}
          showLabel={checkValue("favorites")}
          className={checkValue("favorites") ? "Mui-selected" : ""}
        />
      </Link>
      <Link href="/lists">
        <BottomNavigationAction
          label="Waiting Lists"
          value="lists"
          icon={<List />}
          showLabel={checkValue("lists")}
          className={checkValue("lists") ? "Mui-selected" : ""}
        />
      </Link>
      <Link href="/profile">
        <BottomNavigationAction
          label="Profile"
          value="profile"
          icon={<AccountCircle />}
          showLabel={checkValue("profile")}
          className={checkValue("profile") ? "Mui-selected" : ""}
        />
      </Link>
    </BottomNavigation>
  );
};

export default BottomNav;
