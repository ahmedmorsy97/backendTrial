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

const Resturant = (props) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {props.data.name[0] + ""}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
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
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
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

const Home = (props) => {
  React.useEffect(() => {}, []);

  return (
    <>
      <Head title="Home" />
      <Layout>
        <h2>Places</h2>
        {props?.places.length > 0 ? (
          props.places.map((place, index) => (
            <>
              {console.log(place)}
              <Resturant data={place} key={index} />
            </>
          ))
        ) : (
          <p>No Resturants to be viewed !!!</p>
        )}
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
