const LBP_API_KEY = process.env.LBP_API_KEY
const LBP_API_SECRET = process.env.LBP_API_SECRET
const LBP_ENDPOINT = process.env.LBP_ENDPOINT
const LBP_OWNER_WALLET_ADDRESS = process.env.LBP_OWNER_WALLET_ADDRESS
const LBP_OWNER_WALLET_SECRET = process.env.LBP_OWNER_WALLET_SECRET
const LBP_CONTRACT_ID_LBCC = process.env.LBP_CONTRACT_ID_LBCC
const LBP_CONTRACT_ID_ITEM = process.env.LBP_CONTRACT_ID_ITEM
const LBP_TOKEN_TYPE_LBCR = process.env.LBP_TOKEN_TYPE_LBCR

const PRICE_COFFEE_IN_LBCC = 200
const lbp = require('./lbp')
lbp.init(LBP_ENDPOINT, LBP_API_KEY, LBP_API_SECRET)

async function buyCoffee(userId, landingUri) {
    return await lbp.userPostRequestServiceTokenTransfer(
        userId,
        LBP_OWNER_WALLET_ADDRESS,
        LBP_CONTRACT_ID_LBCC,
        PRICE_COFFEE_IN_LBCC * 1000000,
        landingUri
    )
}

async function rewardTo(txPurchase, userId) {
    const meta = `${new Date().getTime()}|${txPurchase}|${userId}`
    return await lbp.itemTokensPostMintNFT(
        'LBCR',
        meta,
        LBP_OWNER_WALLET_ADDRESS,
        LBP_OWNER_WALLET_SECRET,
        userId,
        LBP_CONTRACT_ID_ITEM,
        LBP_TOKEN_TYPE_LBCR
    )
}

async function getRecent5Rewards(userId) {
    return await lbp.usersGetNftBalanceOfType(userId, LBP_CONTRACT_ID_ITEM, LBP_TOKEN_TYPE_LBCR, 5, 'desc')
}

async function redeem5(userId, tokenIDs) {
    return await lbp.usersPostBatchTransferNft(userId, LBP_CONTRACT_ID_ITEM, LBP_OWNER_WALLET_ADDRESS, tokenIDs, LBP_OWNER_WALLET_ADDRESS, LBP_OWNER_WALLET_SECRET)
}

async function getProxySet(userId) {
    return await lbp.usersGetProxySet(userId, LBP_CONTRACT_ID_ITEM)
}

async function requestProxy(userId) {
    return await lbp.usersPostIssueProxyToken(userId, LBP_CONTRACT_ID_ITEM, LBP_OWNER_WALLET_ADDRESS, null)
}

module.exports = {
    buyCoffee,
    rewardTo,
    getRecent5Rewards,
    redeem5,
    getProxySet,
    requestProxy,
    LBP_API_KEY,
    LBP_API_SECRET,
    LBP_ENDPOINT,
    LBP_OWNER_WALLET_ADDRESS,
    LBP_OWNER_WALLET_SECRET,
    LBP_CONTRACT_ID_LBCC,
    LBP_TOKEN_TYPE_LBCR,
    PRICE_COFFEE_IN_LBCC
}