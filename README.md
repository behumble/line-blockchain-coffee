# LINE Blockchain Coffee

<img src="static/line-coffee.svg" width="200"></img>

a sample service for LINE Blockchain Platform

## DISCLAIMER

the project has a naive implementation for the sake of simplicity.

please expect:

- poor exception handling
- volatile session
- no storage
- copy-n-pasted snippets

## Environment variables

### LINE Blockchain Platform

- `LBP_API_KEY` : API Key assigned at service creation
- `LBP_API_SECRET` : API Secret assigned at service creation
- `LBP_ENDPOINT` : `https://test-api.blockchain.line.me` (cashew) or `https://api.blockchain.line.me` (daphne)
- `LBP_OWNER_WALLET_ADDRESS` : an owner wallet address
- `LBP_OWNER_WALLET_SECRET` : a wallet secret for the owner wallet
- `LBP_CONTRACT_ID_LBCC` : a [Contract ID](https://docs-blockchain.line.biz/glossary?id=contract-id) for `LBCC`(LINE Blockchain Coffee Coin)
- `LBP_CONTRACT_ID_ITEM` : a [Contract ID](https://docs-blockchain.line.biz/glossary?id=contract-id) for [Item tokens](https://docs-blockchain.line.biz/glossary?id=item-token)
- `LBP_TOKEN_TYPE_LBCR` : a Token type for `LBCR`(LINE Blockchain Coffee Reward)

### LINE Login

- `LINE_LOGIN_CHANNEL_ID` : Channel ID (a.k.a. `client_id`) for LINE Login
- `LINE_LOGIN_CHANNEL_SECRET` : Channel secret used in LINE Login to exchange `code` to `acccess token`
- `LINE_LOGIN_CALLBACK_URL` : a redirect URL [defined in OAuth 2.0](https://www.oauth.com/oauth2-servers/redirect-uris/) e.g) http://localhost:3000/api/oauth/callback

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```
