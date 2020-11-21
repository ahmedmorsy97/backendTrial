const secretOrPrivateKey =
  `${process.env.NODE_ENV}` === "production"
    ? process.env.JWT_SECRET
    : "secretOrPrivateKey";

export { secretOrPrivateKey };

// "engines": {
//   "node": "14.x"
// },
// heroku config:set NODE_OPTIONS="--max_old_space_size=2560" -a damp-waters-55084
