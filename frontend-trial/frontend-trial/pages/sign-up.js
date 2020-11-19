import Head from "next/head";
import React from "react";
import Layout from "../components/Layout";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { AlternateEmail, Lock, PhoneIphone } from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import "../styles/form.css";
import axios from "axios";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const SignIn = (props) => {
  const router = useRouter();
  const cookie = Cookies.get("userLogin");
  if (cookie) {
    router.push("/");
  }

  const [email, setEmail] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const signUp = () => {
    const body = {
      email,
      phoneNumber,
      password,
    };
    axios
      .post("/users/register", body, { withCredentials: true })
      .then((res) => {
        router.push("/");
        Cookies.set("userId", res.data._id, {
          expires: new Date(253402300799999),
        });
        // console.log(res.data);
      })
      .catch((err) => {
        console.log("Error is ", err);
      });
  };

  return (
    <>
      <Head title="Sign In" />
      <Layout>
        <h3>Sign Up</h3>
        <div className="form">
          <TextField
            id="input-with-icon-textfield"
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AlternateEmail />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            id="input-with-icon-textfield"
            label="PhoneNumber"
            placeholder="Enter your phoneNumber"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIphone />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            id="input-with-icon-textfield"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={handlePasswordChange}
            type="password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
            }}
          />
          <Button variant="outlined" onClick={() => signUp()}>
            Sign Up
          </Button>
        </div>
      </Layout>
    </>
  );
};

export default SignIn;
