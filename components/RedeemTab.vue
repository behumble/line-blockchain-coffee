<template>
  <div class="d-flex justify-center">
    <div v-if="recent5.length <= 0">
      <h1>No Rewards</h1>
      <h4>Please buy a coffee</h4>
    </div>
    <div v-if="recent5.length > 0">
      <v-timeline dense>
        <v-timeline-item
          small
          :key="reward.tokenIndex"
          v-for="reward in recent5"
        >
          {{ moment(Number(reward.meta.split("|")[0])) }}
        </v-timeline-item>
      </v-timeline>
      <v-btn class="ma-6" :disabled="disabledRedeem" @click="redeem()"
        >Redeem</v-btn
      >
    </div>

    <v-dialog v-model="passCodeCompletionDialog" width="500px">
      <v-card>
        <v-card-title class="headline"
          >Reward token management delegation</v-card-title
        >
        <v-card-text>{{
          errorMessage || "Please grant a proxy for LBCR"
        }}</v-card-text>
        <v-btn text @click="confirmRequestSession()">Confirmed</v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";

export default {
  async mounted() {
    this.updateBalance();

    setInterval(() => {
      this.updateBalance();
    }, 1000);
  },
  data() {
    return {
      recent5: [],
      type: null,
      disabledRedeem: true,
      tokenInProgress: null,
      passCodeCompletionDialog: false,
      errorMessage: null,
    };
  },
  methods: {
    async updateBalance() {
      try {
        const resp = await axios.get(`/api/rewards`);
        this.recent5 = resp.data.list;
        this.type = resp.data.type;
        this.disabledRedeem = this.recent5.length < 5;
      } catch (error) {
        console.error(error);
      }
    },
    moment(timestamp) {
      return moment(timestamp).fromNow();
    },
    async redeem() {
      const resp = await axios.get("/api/proxy");

      if (resp.data.responseData.isApproved) {
        // proxy has set
        const reqBody = {
          tokens: this.recent5.map(
            (token) => `${this.type}${token.tokenIndex}`
          ),
        };
        try {
          const resp = await axios.post(`/api/redeem`, reqBody);
          location.reload();
        } catch (error) {
          console.error(error);
        }
      } else {
        // proxy has not set
        this.passCodeCompletionDialog = true;
        const resp = await axios.post("/api/proxy");
        this.tokenInProgress = resp.data.responseData.requestSessionToken;
      }
    },
    async confirmRequestSession() {
      try {
        const resp = await this.$axios.$post(
          `/api/request-commit/${this.tokenInProgress}`
        );
        this.tokenInProgress = null;
        this.passCodeCompletionDialog = false;
        console.log("confirmRequestSession", resp);
      } catch (error) {
        console.error("RedeemTab.confirmRequestSession", error);
        this.errorMessage = "Transaction is not granted";
      }
    },
  },
};
</script>