import express, { json } from "express";
import cors from "cors";

const users = [];
const tweets = [];

function isUserSignedUp(username) {
  return users.map((user) => user.username).includes(username);
}

function isValidUser(user) {
  const { username, avatar } = user;
  return (
    typeof username === "string" &&
    username.length !== 0 &&
    typeof avatar === "string" &&
    avatar.length !== 0
  );
}

function isValidTweet(tweet) {
  const { username, tweet: text } = tweet;
  return (
    typeof username === "string" &&
    username.length !== 0 &&
    typeof text === "string" &&
    text.length !== 0
  );
}

const app = express();
app.use(cors());
app.use(json());

app.post("/sign-up", (req, res) => {
  const user = req.body;
  users.push(user);

  res.send("OK");
});

app.post("/tweets", (req, res) => {
  const tweet = req.body;
  const { username } = tweet;

  if (isUserSignedUp(username)) {
    const user = users.find((user) => user.username === username);
    const { avatar } = user;
    tweet.avatar = avatar;
    tweets.push(tweet);

    res.send("OK");
  } else {
    res.send("Você não está cadastrado!");
  }
});

app.get("/tweets", (req, res) => {
  const numTweets = tweets.length;
  const firstIndex = numTweets > 10 ? numTweets - 10 : 0;
  res.send(tweets.slice(firstIndex));
});

app.get("/tweets/:username", (req, res) => {
  const { username } = req.params;
  res.send(tweets.filter((tweet) => tweet.username === username));
});

app.listen(5000, () => {
  console.log("Rodando em http://localhost:5000");
});
