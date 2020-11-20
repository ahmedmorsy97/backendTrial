import React from "react";
import Head from "../components/head";
import Layout from "../components/Layout";
import axios from "axios";

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import Cookies from "js-cookie";
import { useRouter } from "next/router";
import "../styles/global.css";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

const Place = (props) => {
  const router = useRouter();
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // console.log(props.user);

  const favoritePlaceUpdate = (id) => {
    const favoratePlaces = props.user?.favoratePlaces || [];

    if (favoratePlaces?.map((el) => el._id).includes(id)) {
      axios
        .post(
          "/users/removeFromArray",
          {
            subdocumentName: "favoratePlaces",
            subdocumentId: props.data._id,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          // console.log(res.data);
          return axios.get("/users/me", {
            withCredentials: true,
          });
        })
        .then((user) => {
          props.setUser(user.data);
        })
        .catch((err) => {
          const error = err?.response;
          const message = JSON.stringify(error?.data, undefined, 2);
          alert(error?.status + " - " + message);
        });
    } else {
      axios
        .post(
          "/users/addToArray",
          {
            subdocumentName: "favoratePlaces",
            subdocumentBody: props.data._id,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          // console.log(res.data);
          return axios.get("/users/me", {
            withCredentials: true,
          });
        })
        .then((user) => {
          props.setUser(user.data);
        })
        .catch((err) => {
          const error = err?.response;
          const message = JSON.stringify(error?.data, undefined, 2);
          alert(error?.status + " - " + message);
        });
    }
  };

  return (
    <Card
      className={classes.root}
      style={{ maxWidth: 345, width: "100%", marginBottom: 10 }}
    >
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {props.data.name[0] + ""}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon
              onClick={() =>
                router.push({
                  pathname: "/place/[slug]",
                  query: { slug: props.data._id },
                })
              }
            />
          </IconButton>
        }
        title={props.data.name}
        subheader={props.data.branch + " - " + props.data.category}
      />
      {/* <CardMedia className={classes.media} image="" title="Paella dish" /> */}
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          <b>Is Waiting list Opened</b>{" "}
          {props.data.openWaitinglist ? "yes" : "no"}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          <b>Is Waiting list Stoped</b>{" "}
          {props.data.stopWaitingList ? "yes" : "no"}
        </Typography>
      </CardContent>
      <CardActions
        disableSpacing
        style={{
          justifyContent: "space-between",
        }}
      >
        <IconButton
          aria-label="add to favorites"
          onClick={() => favoritePlaceUpdate(props.data._id)}
          className={
            props?.user?.favoratePlaces
              ?.map((el) => el._id)
              .includes(props.data._id)
              ? "isFavorate"
              : ""
          }
        >
          <FavoriteIcon />
        </IconButton>
        {/* <IconButton aria-label="share">
            <ShareIcon />
          </IconButton> */}
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph component="div">
            <b>Has Outdoor</b>
            <p style={{ marginTop: 5 }}>
              {props.data.isInOutdoor ? "yes" : "no"}
            </p>
          </Typography>
          <Typography paragraph component="div">
            <b>Mobile Number/s</b>
            {props.data.mobileNumbers.map((number, index) => (
              <p key={index} style={{ marginTop: 5 }}>
                {number}
              </p>
            ))}
          </Typography>
          <Typography paragraph component="div">
            <b>Working Hours</b>
            <p style={{ marginTop: 5 }}>
              <b>Open: </b>
              {props.data.workingHours.open}
            </p>
            <p style={{ marginTop: 5 }}>
              <b>Close: </b>
              {props.data.workingHours.close}
            </p>
            <p style={{ marginTop: 5 }}>
              <b>Never Close: </b>
              {props.data.workingHours.neverClose ? "yes" : "no"}
            </p>
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default Place;
