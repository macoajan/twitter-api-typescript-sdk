// Copyright 2021 Twitter, Inc.
// SPDX-License-Identifier: Apache-2.0

import { Client, auth } from "twitter-api-sdk";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const authClient = new auth.OAuth2User({
  client_id: process.env.CLIENT_ID as string,
  client_secret: process.env.CLIENT_SECRET as string,
  callback: "http://127.0.0.1:3000/callback",
  scopes: ["tweet.read", "users.read", "offline.access"],
});

const client = new Client(authClient);

const STATE = "my-state";

app.get("/callback", async function (req, res) {
  try {
    const { code, state } = req.query;
    if (state !== STATE) {
      return res.status(500).send("State isn't matching");
    }
    await authClient.requestAccessToken(code as string);
    res.redirect("/tweets");
  } catch (error) {
    console.log(error);
  }
});

app.get("/login", async function (req, res) {
  const authUrl = authClient.generateAuthURL({
    state: STATE,
    code_challenge: "challenge",
  });
  res.redirect(authUrl);
});

app.get("/tweets", async function (req, res) {
  const tweets = await client.tweets.findTweetById("20");
  res.send(tweets.data);
});

app.get("/revoke", async function (req, res) {
  const refresh_token = authClient.refresh_token;
  if (refresh_token) {
    const response = await authClient.revokeAccessToken();
    return res.send(response);
  }
  res.send("No access token to revoke");
});

app.listen(3000, () => {
  console.log(`Go here to login: http://127.0.0.1:3000/login`);
});
