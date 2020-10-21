<template>
  <v-app>
    <v-main class="yellow">
      <v-container fluid class="fill-height">
        <nuxt />
      </v-container>
    </v-main>
    <v-footer class="justify-center" app fixed>
      <v-btn text href="https://blockchain.line.biz/">LINE Blockchain Developers</v-btn>
      <v-btn text href="https://wallet.bitmax.me/">BITMAX Wallet</v-btn>
      <v-btn text href="https://explorer.blockchain.line.me/">LINE Blockchain Explorer</v-btn>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      title: "LINE Blockchain Coffee",
    };
  },
};
</script>
