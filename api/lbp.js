const _ = require('lodash')
const crypto = require('crypto')
const axios = require('axios')

let _endpoint = null
let _apiKey = null
let _apiSecret = null

function init(endpoint, apiKey, apiSecret) {
    _endpoint = endpoint
    _apiKey = apiKey
    _apiSecret = apiSecret
}

function generateSignature(nonce, timestamp, method, uri, body) {
    // https://docs-blockchain.line.biz/api-guide/Authentication
    var signTarget = `${nonce}${timestamp}${method}${uri}`

    if (body) {
        if (signTarget.indexOf('?') < 0) {
            signTarget += '?'
        } else {
            signTarget += '&'
        }
        // TODO any way more neat?
        const objBody = body
        const flatPair = {}     // we're going to convert objBody to flatPair
        Object.keys(objBody).forEach(key => {
            const value = objBody[key]
            if (Array.isArray(value)) {
                // scan for all sub-keys
                let allSubKeys = []
                value.forEach(elem => {
                    allSubKeys = _.union(allSubKeys, Object.keys(elem))
                })
                // now we have keys for elements. fill-in flatPair
                value.forEach(elem => { // for each element on the array
                    allSubKeys.forEach(subKey => {
                        const flatKey = `${key}.${subKey}`
                        const flatRawValue = elem[subKey] ? elem[subKey] : ''
                        const prevFlatValue = flatPair[flatKey]
                        const flatValue = prevFlatValue == undefined ? flatRawValue : `${prevFlatValue},${flatRawValue}`
                        flatPair[flatKey] = flatValue
                    })
                })
            } else {
                flatPair[key] = objBody[key]
            }
        })
        const bodyPart = Object.keys(flatPair).sort().map(key => `${key}=${flatPair[key]}`).join('&')
        signTarget += bodyPart
    }
    const hmac = crypto.createHmac('sha512', _apiSecret)
    const signature = hmac.update(signTarget).digest('base64')
    return signature
}

async function usersGetServiceTokenBalance(userId, contractId) {
    const uri = `/v1/users/${userId}/service-tokens/${contractId}`
    const url = `${_endpoint}${uri}`
    const timestamp = new Date().getTime().toString()
    const nonce = timestamp.slice(-8)
    const signature = generateSignature(nonce, timestamp, 'GET', uri, null)
    const lbpResp = await axios.get(url, {
        headers: {
            timestamp,
            'service-api-key': _apiKey,
            nonce,
            signature
        }
    })
    return lbpResp.data
}

// https://docs-blockchain.line.biz/api-guide/category-users?id=issue-a-session-token-for-service-token-transfer
async function userPostRequestServiceTokenTransfer(userId, toAddress, contractId, amountInNum, landingUri) {
    console.log('lbp.userPostRequestServiceTokenTransfer', landingUri)
    const requestType = landingUri ? 'redirectUri' : 'aoa'
    const uri = `/v1/users/${userId}/service-tokens/${contractId}/request-transfer?requestType=${requestType}`
    const url = `${_endpoint}${uri}`
    const timestamp = new Date().getTime().toString()
    const nonce = timestamp.slice(-8)
    const amount = amountInNum.toString()
    const reqBody = {
        toAddress,
        amount
    }

    if(landingUri) {
        reqBody.landingUri = landingUri
    }
    const signature = generateSignature(nonce, timestamp, 'POST', uri, reqBody)
    const lbpResp = await axios.post(url, reqBody, {
        headers: {
            timestamp,
            'service-api-key': _apiKey,
            nonce,
            signature,
            'Content-Type': 'application/json'
        }
    })
    console.log('[lbp] response :', lbpResp.data)
    return lbpResp.data
}

async function userPostCommitRequest(requestSessionToken) {
    const uri = `/v1/user-requests/${requestSessionToken}/commit`
    const url = `${_endpoint}${uri}`
    const timestamp = new Date().getTime().toString()
    const nonce = timestamp.slice(-8)
    const signature = generateSignature(nonce, timestamp, 'POST', uri, null)
    const lbpResp = await axios.post(url, {}, {
        headers: {
            timestamp,
            'service-api-key': _apiKey,
            nonce,
            signature,
            'Content-Type': 'application/json'
        }
    })
    return lbpResp.data
}

async function usersGetServiceTokenBalance(userId, contractId) {
    const uri = `/v1/users/${userId}/service-tokens/${contractId}`
    const url = `${_endpoint}${uri}`
    const timestamp = new Date().getTime().toString()
    const nonce = timestamp.slice(-8)
    const signature = generateSignature(nonce, timestamp, 'GET', uri, null)
    const lbpResp = await axios.get(url, {
        headers: {
            timestamp,
            'service-api-key': _apiKey,
            nonce,
            signature
        }
    })
    return lbpResp.data
}

// https://docs-blockchain.line.biz/api-guide/category-item-tokens?id=mint-a-non-fungible
async function itemTokensPostMintNFT(name, meta, ownerAddress, ownerSecret, toUserId, contractId, tokenType) {
    const uri = `/v1/item-tokens/${contractId}/non-fungibles/${tokenType}/mint`
    const url = `${_endpoint}${uri}`
    const timestamp = new Date().getTime().toString()
    const nonce = timestamp.slice(-8)
    const reqBody = {
        toUserId,
        name,
        meta,
        ownerAddress,
        ownerSecret
    }
    const signature = generateSignature(nonce, timestamp, 'POST', uri, reqBody)
    const lbpResp = await axios.post(url, reqBody, {
        headers: {
            timestamp,
            'service-api-key': _apiKey,
            nonce,
            signature,
            'Content-Type': 'application/json'
        }
    })
    return lbpResp.data
}

// https://docs-blockchain.line.biz/api-guide/category-users?id=retrieve-balance-of-specific-type-of-non-fungibles-user-wallet
async function usersGetNftBalanceOfType(userId, contractId, tokenType, limit, orderBy) {
    const uri = `/v1/users/${userId}/item-tokens/${contractId}/non-fungibles/${tokenType}?limit=${limit}&orderBy=${orderBy}`
    const url = `${_endpoint}${uri}`
    const timestamp = new Date().getTime().toString()
    const nonce = timestamp.slice(-8)
    const signature = generateSignature(nonce, timestamp, 'GET', uri, null)
    const lbpResp = await axios.get(url, {
        headers: {
            timestamp,
            'service-api-key': _apiKey,
            nonce,
            signature
        }
    })
    return lbpResp.data
}

// https://docs-blockchain.line.biz/api-guide/category-users?id=batch-transfer-non-fungibles-user-wallet
async function usersPostBatchTransferNft(userId, contractId, toAddress, tokenIDs, ownerAddress, ownerSecret) {
    const uri = `/v1/users/${userId}/item-tokens/${contractId}/non-fungibles/batch-transfer`
    const url = `${_endpoint}${uri}`
    const timestamp = new Date().getTime().toString()
    const nonce = timestamp.slice(-8)
    const transferList = tokenIDs.map(id => { return { tokenId: id } })
    const reqBody = {
        ownerAddress,
        ownerSecret,
        toAddress,
        transferList
    }
    const signature = generateSignature(nonce, timestamp, 'POST', uri, reqBody)
    const lbpResp = await axios.post(url, reqBody, {
        headers: {
            timestamp,
            'service-api-key': _apiKey,
            nonce,
            signature,
            'Content-Type': 'application/json'
        }
    })
    console.log('lbp.usersPostBatchTransferNft', lbpResp.data)
    return lbpResp.data
}

// https://docs-blockchain.line.biz/api-guide/category-users?id=retrieve-whether-the-proxy-set-or-not
async function usersGetProxySet(userId, contractId) {
    const uri = `/v1/users/${userId}/item-tokens/${contractId}/proxy`
    const url = `${_endpoint}${uri}`
    const timestamp = new Date().getTime().toString()
    const nonce = timestamp.slice(-8)
    const signature = generateSignature(nonce, timestamp, 'GET', uri, null)
    const lbpResp = await axios.get(url, {
        headers: {
            timestamp,
            'service-api-key': _apiKey,
            nonce,
            signature
        }
    })
    console.log('lbp.usersGetProxySet', lbpResp.data)
    return lbpResp.data
}

// https://docs-blockchain.line.biz/api-guide/category-users?id=issue-a-session-token-for-proxy-setting
async function usersPostIssueProxyToken(userId, contractId, ownerAddress, landingUri) {
    const requestType = landingUri ? 'redirectUri' : 'aoa'
    const uri = `/v1/users/${userId}/item-tokens/${contractId}/request-proxy?requestType=${requestType}`
    const url = `${_endpoint}${uri}`
    const timestamp = new Date().getTime().toString()
    const nonce = timestamp.slice(-8)
    const reqBody = {
        ownerAddress
    }
    const signature = generateSignature(nonce, timestamp, 'POST', uri, reqBody)
    const lbpResp = await axios.post(url, reqBody, {
        headers: {
            timestamp,
            'service-api-key': _apiKey,
            nonce,
            signature,
            'Content-Type': 'application/json'
        }
    })
    console.log('lbp.usersPostIssueProxyToken', lbpResp.data)
    return lbpResp.data
}

module.exports = {
    generateSignature,
    usersGetServiceTokenBalance,
    userPostRequestServiceTokenTransfer,
    userPostCommitRequest,
    init,
    itemTokensPostMintNFT,
    usersGetNftBalanceOfType,
    usersPostBatchTransferNft,
    usersGetProxySet,
    usersPostIssueProxyToken
}