# Twitter API SDK for TypeScript

## Introduction

A TypeScript SDK for the Twitter API. This library is built with TypeScript developers in mind, but it also works with JavaScript.

**Note: This SDK is in beta and is not ready for production**

You can find examples of using the client in the [examples/](examples/) directory

**Note: Only Twitter API V2 is supported**

### Features

- Full type information for requests and responses
- OAuth2 support
- Supports Node.js 14+. **Doesn't work in browser environments due to the Twitter API not supporting CORS**

## Installing

```
npm install twitter-api-sdk
```

## Client

To setup the client we will authenticate with a bearer-token as follows

```typescript
import { Client } from "twitter-api-sdk";

const client = new Client("MY-BEARER-TOKEN");
```

For more information about authentication [go here](#authentication)

## Examples

### Consuming a stream

```typescript
import { Client } from "twitter-api-sdk";

const client = new Client(process.env.BEARER_TOKEN);

async function main() {
  const stream = client.tweets.sampleStream({
    "tweet.fields": ["author_id"],
  });
  for await (const tweet of stream) {
    console.log(tweet.data?.author_id);
  }
}

main();
```

### Getting a tweet

```typescript
import { Client } from "twitter-api-sdk";

const client = new Client(process.env.BEARER_TOKEN);

async function main() {
  const tweet = await client.tweets.findTweetById("20");
  console.log(tweet.data.text);
}

main();
```

## Streaming

For endpoints that return a stream you get sent back an Async Generator which you can iterate over:

```typescript
const stream = client.tweets.sampleStream();

for await (const tweet of stream) {
  console.log(tweet.data.text);
}
```

## Pagination

For endpoints that have pagination you can

```typescript
const followers = client.users.usersIdFollowers("20");

for await (const page of followers) {
  console.log(page.data);
}

// This also works
const followers = await client.users.usersIdFollowers("20");
console.log(followers.data);
```

## Authentication

This library supports App-only Bearer Token and OAuth 2.0

You can see various examples on how to use the authentication in [examples/](examples/)

## Getting Started

Make sure you to turn on OAuth2 in your apps user authentication settings, and set the type of app to be a confidential client (Web App or Automated App or Bot).

### Creating an Auth Client

```typescript
const authClient = new auth.OAuth2User({
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  callback: "http://127.0.0.1:3000/callback",
  scopes: ["tweet.read", "users.read", "offline.access"],
});

const client = new Client(authClient);
```

### Generating an Authentication URL

```typescript
const authUrl = authClient.generateAuthURL({
  code_challenge_method: "s256",
});
```

### Getting an Access Token

Once the user has approved the OAuth flow, you will receive a `code` query parameter at the callback URL you specified.

```typescript
await authClient.requestAccessToken(code);
```

### Revoking an Access Token

```typescript
const response = await authClient.revokeAccessToken();
```
