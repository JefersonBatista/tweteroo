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
  const { username, tweet: text, avatar } = tweet;
  return (
    typeof username === "string" &&
    username.length !== 0 &&
    typeof text === "string" &&
    text.length !== 0 &&
    typeof avatar === "string" &&
    avatar.length !== 0
  );
}

function isValidPageNumber(pageNumber) {
  return pageNumber && pageNumber > 0;
}

const app = express();
app.use(cors());
app.use(json());

app.post("/sign-up", (req, res) => {
  const user = req.body;

  if (isValidUser(user)) {
    users.push(user);
    res.sendStatus(201);
  } else {
    res.status(400).send("Todos os campos são obrigatórios!");
  }
});

app.post("/tweets", (req, res) => {
  const tweet = req.body;
  const { user: username } = req.headers;
  tweet.username = username;

  if (isUserSignedUp(username)) {
    const user = users.find((user) => user.username === username);
    const { avatar } = user;
    tweet.avatar = avatar;

    if (isValidTweet(tweet)) {
      tweets.push(tweet);
      res.sendStatus(201);
    } else {
      res.status(400).send("Todos os campos são obrigatórios!");
    }
  } else {
    res.status(401).send("Você não está cadastrado!");
  }
});

app.get("/tweets", (req, res) => {
  const page = parseInt(req.query.page);
  const pageSize = 10;

  if (isValidPageNumber(page)) {
    const numTweets = tweets.length;
    const beginIndex = numTweets - pageSize * page;
    const endIndex = beginIndex + pageSize;
    const pageBegin = beginIndex > 0 ? beginIndex : 0;
    const pageEnd = endIndex > 0 ? endIndex : 0;

    res.status(200).send(tweets.slice(pageBegin, pageEnd).reverse());
  } else {
    res.status(400).send("Informe uma página válida!");
  }
});

app.get("/tweets/:username", (req, res) => {
  const { username } = req.params;
  res.status(200).send(tweets.filter((tweet) => tweet.username === username));
});

app.listen(5000, () => {
  console.log("Rodando em http://localhost:5000");
});
