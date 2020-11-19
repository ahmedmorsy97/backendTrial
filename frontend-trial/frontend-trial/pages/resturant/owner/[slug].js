import Head from "next/head";
import React from "react";
import "../../../styles/place.css";
import Layout from "../../../components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import socketIOClient from "socket.io-client";

import * as Socket from "../../../utils/socket";

import { AccountCircle, SupervisedUserCircle } from "@material-ui/icons";
import Badge from "@material-ui/core/Badge";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const userId = Cookies.get("userId") || "";
const token = Cookies.get("userLogin") || "";

const WaitingUser = (props) => {
  const classes = useStyles();
  const leaveGuestList = () => {
    axios
      .post(
        `/places/owner/removeFromWaitingList/${props.placeId}`,
        {
          waitingId: props.data._id,
        },
        {
          headers: {
            "x-auth": token,
          },
        }
      )
      .then((res) => {
        console.log(res);
        Socket.updateWaitingList(props.placeId, "leave waiting list");
        props.placeFetch();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const delayGuestList = () => {
    axios
      .post(
        `/places/owner/delayInWaitingList/${props.placeId}`,
        {
          delayNumber: 1,
        },
        {
          headers: {
            "x-auth": token,
          },
        }
      )
      .then((res) => {
        console.log(res);
        Socket.updateWaitingList(props.placeId, "delay one in waiting list");
        props.placeFetch();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const popFromList = (attendance) => {
    axios
      .post(
        `/places/owner/popFromWaitingList/${props.placeId}`,
        { attendance },
        {
          headers: {
            "x-auth": token,
          },
        }
      )
      .then((res) => {
        console.log(res);
        Socket.updateWaitingList(props.placeId, "pop guset from waiting list");
        props.placeFetch();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return !props.data.isUser ? (
    <Card className={classes.root + " card active"}>
      <Typography className={classes.title} color="textSecondary" gutterBottom>
        {props.data.displayName}
        {/* - {props.index} */}
      </Typography>
      <div className="cardActions">
        {props.index === 1 ? (
          <>
            <Button size="small" onClick={() => popFromList("missed")}>
              Miss
            </Button>
            <Button size="small" onClick={() => popFromList("attended")}>
              Attend
            </Button>
          </>
        ) : (
          <></>
        )}
        <Button size="small" onClick={() => leaveGuestList()}>
          Remove
        </Button>
        <Button size="small" onClick={() => delayGuestList()}>
          Delay
        </Button>
        <Badge
          badgeContent={props.data.numberOfPeople}
          color="error"
          className="badge"
        >
          <AccountCircle />
        </Badge>
      </div>
    </Card>
  ) : (
    <Card className={classes.root + " card"}>
      <Typography className={classes.title} color="textSecondary" gutterBottom>
        {props.data.displayName}
      </Typography>
      <div className="cardActions">
        {props.index === 1 ? (
          <>
            <Button size="small" onClick={() => popFromList("missed")}>
              Miss
            </Button>
            <Button size="small" onClick={() => popFromList("attended")}>
              Attend
            </Button>
          </>
        ) : (
          <></>
        )}
        <Badge
          badgeContent={props.data.numberOfPeople}
          color="error"
          className="badge"
        >
          <AccountCircle />
        </Badge>
      </div>
    </Card>
  );
};

// place owner component
const PlaceOwner = (props) => {
  const classes = useStyles();
  const router = useRouter();
  const cookie = Cookies.get("userLogin");

  const [place, setPlace] = React.useState(props.place);
  const [NumberOfPeople, setNumberOfPeople] = React.useState("");
  const [DisplayName, setDisplayName] = React.useState("");

  const handleNumberOfPeopleChange = (e) => {
    setNumberOfPeople(e.target.value);
  };

  const handleDisplayNameChange = (e) => {
    setDisplayName(e.target.value);
  };

  React.useEffect(() => {
    Socket.initiateSocket({ placeId: place._id });
    Socket.subscribeToWaitingList((err, data) => {
      if (err) return;
      console.log(data);
      placeFetch();
    });

    return () => {
      Socket.disconnectSocket();
    };
  }, []);

  const placeFetch = () => {
    axios
      .get(`/places/readOne/${props.params.slug}`)
      .then((res) => {
        setPlace(res.data.place);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addGuestToList = () => {
    axios
      .post(
        `/places/owner/addToWaitingList/${props.params.slug}`,
        {
          numberOfPeople: NumberOfPeople !== "" ? NumberOfPeople : 1,
          displayName: DisplayName !== "" ? DisplayName : "User",
        },
        {
          headers: {
            "x-auth": token,
          },
        }
      )
      .then((res) => {
        Socket.updateWaitingList(props.place._id, "join the waiting list");
        console.log(res);
        placeFetch();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Head title="Resturant" />
      <Layout>
        <h2>{`${place.name}'s Waiting List`}</h2>
        <div className="form">
          <TextField
            id="input-with-icon-textfield"
            label="Number Of People"
            placeholder="Enter your number of people"
            value={NumberOfPeople}
            onChange={handleNumberOfPeopleChange}
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SupervisedUserCircle />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            id="input-with-icon-textfield"
            label="Display Name"
            placeholder="Enter your display name"
            value={DisplayName}
            onChange={handleDisplayNameChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
          />
          <Button variant="outlined" onClick={() => addGuestToList()}>
            Add Guest
          </Button>
        </div>
        <div className="">
          {place.waitingList.map((user, index) => (
            // <>
            //   {console.log(user)}
            <WaitingUser
              id={user.user}
              index={index + 1}
              key={index}
              placeId={props.place._id}
              data={user}
              placeFetch={placeFetch}
            />
            // </>
          ))}
        </div>
      </Layout>
    </>
  );
};

export async function getServerSideProps(params) {
  //   console.log(params);
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://damp-waters-55084.herokuapp.com/api"
      : "http://localhost:5000/api";
  const res = await axios.get(baseUrl + `/places/readOne/${params.query.slug}`);

  const data = await res.data;
  return {
    props: {
      place: data.place || {},
      params: params.query,
    },
  };
}

export default React.memo(PlaceOwner);
