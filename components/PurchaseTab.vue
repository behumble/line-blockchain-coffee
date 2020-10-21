<template>
  <v-row class="pa-6">
    <v-col cols="12" sm="4">
      <CoffeeCoinBalance />
    </v-col>
    <v-col cols="12" sm="4">
      <v-card>
        <div class="yellow pa-6 d-flex justify-center" style="height: 200px">
          <img src="/line-coffee.svg" width="200px" />
        </div>
        <v-card-title>Americano (200 LBCC)</v-card-title>
        <v-card-actions>
          <v-btn text @click="buyCoffee()">Buy(aoa)</v-btn>
          <v-btn text @click="buyCoffee('http://localhost:3000/commit')"
            >Buy(redirect)</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12" sm="4">
      <v-card>
        <div class="yellow pa-6 d-flex justify-center" style="height: 200px">
          <img src="/LBCC.png" style="width: 180px; height: 180px" />
        </div>
        <v-card-title>Coffee Coin</v-card-title>
        <v-card-actions>
          <v-btn text @click="buyLbcc()">Buy</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>

    <v-dialog v-model="lbccBuyDialog" width="500px"> 
      <v-card>
        <v-card-title class="headline">Mint it</v-card-title>
        <v-card-text>
          Assuming that the user has paid for 500 LBCC. please call 
          <a
            href="https://docs-blockchain.line.biz/api-guide/category-service-tokens?id=mint-a-service-token"
            >Mint API</a
          > manually
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="passCodeCompletionDialog" width="500px">
      <v-card>
        <v-card-title class="headline">Check your LINE app</v-card-title>
        <v-card-text>{{ errorMessage || 'Please input passcode to grant the transaction'}}</v-card-text>
        <v-btn text @click="confirmRequestSession()">Confirmed</v-btn>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import CoffeeCoinBalance from "./CoffeeCoinBalance"

export default {
  data() {
    return {
      lbccBuyDialog: false,
      tokenInProgress: null,
      passCodeCompletionDialog: false,
      errorMessage: null
    };
  },
  methods: {
    buyLbcc() {
      this.lbccBuyDialog = true
    },
    async buyCoffee(landingUri) {
      if(!landingUri) {
        // 'aoa' flow
        this.passCodeCompletionDialog = true
      }

      const reqBody = landingUri ? { landingUri } : null
      const resp = await this.$axios.$post("/api/coffee", reqBody)
      const passCodeInputUri = resp.responseData.redirectUri
      if (passCodeInputUri) {
        // 'redirectUri' flow
        const token = resp.responseData.requestSessionToken
        localStorage.setItem("session-token", token)
        window.location.href = passCodeInputUri
      } else {
        this.tokenInProgress = resp.responseData.requestSessionToken
      }
    },

    async confirmRequestSession() {
      try {
        const resp = await this.$axios.$post(
          `/api/request-commit/${this.tokenInProgress}`
        )
        this.tokenInProgress = null
        this.passCodeCompletionDialog = false
        console.log("confirmRequestSession", resp)
      } catch (error) {
        console.error('PurchaseTab.confirmRequestSession', error)
        this.errorMessage = 'Transaction is not granted'
      }
    },
  },
  components: {
    CoffeeCoinBalance,
  },
};
</script>