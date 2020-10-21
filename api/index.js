const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const LineLogin = require('line-login')
const session = require('express-session')
const lbp = require('./lbp')
const coffee = require('./coffee')
const sessionOpts = {
    secret: process.env.LINE_LOGIN_CHANNEL_SECRET,
    resave: false,
    saveUninitialized: false
}

app.use(bodyParser.json())
app.use(session(sessionOpts))

const login = new LineLogin({
    channel_id: process.env.LINE_LOGIN_CHANNEL_ID,
    channel_secret: process.env.LINE_LOGIN_CHANNEL_SECRET,
    callback_url: process.env.LINE_LOGIN_CALLBACK_URL,
    scope: 'openid profile email',
    prompt: 'consent',
    bot_prompt: 'normal'
})

app.get('/login', login.auth())
app.use('/oauth/callback', login.callback(
    (req, res, next, tokenResponse) => {
        console.log(req.method, req.originalUrl, tokenResponse)
        const lineUserId = tokenResponse.id_token.sub
        const displayName = tokenResponse.id_token.name
        const picture = tokenResponse.id_token.picture
        // TODO: user info should be store in DB while session should store only user-id
        req.session["user"] = {
            user_id: lineUserId,
            disp_name: displayName,
            picture
        }
        res.redirect('/')
    },
    (req, res, next, error) => {
        res.status(400).json(error);
    }))

app.get('/check', async (req, res) => {
    try {
        const lbpResp = await lbp.userPostRequestServiceTokenTransfer(
            'Uc10466f09b379c1095cdd9e35faa5b14',  // Alan
            lbp.LBP_OWNER_WALLET_ADDRESS,
            coffee.LBP_CONTRACT_ID_LBCC,
            coffee.PRICE_COFFEE_IN_LBCC)
        res.json(lbpResp)
    } catch (error) {
        res.json(error)
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

const ensureLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return next()
    } else {
        res.sendStatus(401)
    }
}

app.get('/user', ensureLoggedIn, (req, res) => {
    const user = req.session.user
    res.json(user)
})

app.get('/coffee-coin', ensureLoggedIn, async (req, res) => {
    const user = req.session.user
    try {
        const lbpResp = await lbp.usersGetServiceTokenBalance(user.user_id, coffee.LBP_CONTRACT_ID_LBCC)
        res.json(lbpResp)
    } catch (error) {
        res.json(error)
    }
})

app.post('/coffee', ensureLoggedIn, async (req, res) => {
    const user = req.session.user
    const landingUri = req.body.landingUri
    try {
        const resp = await coffee.buyCoffee(user.user_id, landingUri)
        res.json(resp)
    } catch (error) {
        console.error(error)
        res.json(error)
    }
})

app.get('/rewards', ensureLoggedIn, async (req, res) => {
    const user = req.session.user
    try {
        const resp = await coffee.getRecent5Rewards(user.user_id)
        const listWithType = {
            list: resp.responseData,
            type: coffee.LBP_TOKEN_TYPE_LBCR
        }
        res.json(listWithType)
    } catch (error) {
        console.error(error)
        res.json(error)
    }
})

app.get('/proxy', ensureLoggedIn, async (req, res) => {
    const user = req.session.user
    try {
        const resp = await coffee.getProxySet(user.user_id)
        res.json(resp)
    } catch (error) {
        console.error(error)
        res.json(error)
    }
})

app.post('/proxy', ensureLoggedIn, async (req, res) => {
    const user = req.session.user
    try {
        const resp = await coffee.requestProxy(user.user_id)
        res.json(resp)
    } catch (error) {
        console.error(error)
        res.json(error)
    }
})

app.post('/redeem', ensureLoggedIn, async (req, res) => {
    const user = req.session.user
    console.log('index.js /redeem', req.body)
    try {
        const resp = await coffee.redeem5(user.user_id, req.body.tokens)
        res.json(resp)
    } catch (error) {
        console.error(error)
        res.json(error)
    }
})

app.post('/request-commit/:sessionToken', ensureLoggedIn, async (req, res) => {
    const user = req.session.user
    try {
        const lbpResp = await lbp.userPostCommitRequest(req.params.sessionToken)
        // DO NOT USE THIS IN PRODUCTION
        // we skipped status check for the purchase transaction here for simplicity
        // You'll be using transcation callback or status polling for real workload
        coffee.rewardTo(lbpResp.responseData.txHash, user.user_id)
        res.json(lbpResp)
    } catch (error) {
        console.error('index.js - request-commit - catch', JSON.stringify(error))
        res.status(403).json(error)
    }
})

module.exports = {
    path: '/api/',
    handler: app
}
