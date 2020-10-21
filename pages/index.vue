<template>
  <v-container>
    <div v-if="user" class="d-flex justify-center">
      <v-app-bar app>
        <v-tabs v-model="tab" fixed-tabs background-color="transparent">
          <v-tab>Purchase</v-tab>
          <v-tab>Redeem</v-tab>
        </v-tabs>

        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-avatar v-on="on">
              <img :src="user.picture" :alt="user.disp_name" />
            </v-avatar>
          </template>
          <v-list>
            <v-list-item>{{ user.disp_name }}</v-list-item>
            <v-list-item>{{ user.user_id }}</v-list-item>
            <v-list-item href="/api/logout">Logout</v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>

      <v-row>
        <v-col>
          <v-tabs-items v-model="tab" class="transparent">
            <v-tab-item>
              <PurchaseTab> </PurchaseTab>
            </v-tab-item>
            <v-tab-item><RedeemTab> </RedeemTab></v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <div class="d-flex justify-center ma-10">
        <h1 class="justify-center">Welcome to LINE Blockchain Coffee</h1>
      </div>
      <div class="d-flex justify-center">
        <img src="/line-coffee.svg" width="300px" />
      </div>
      <div class="d-flex justify-center ma-5">
        <v-btn outlined href="/api/login" class="pa-6">Login with LINE</v-btn>
      </div>
    </div>
  </v-container>
</template>

<script>
import PurchaseTab from "../components/PurchaseTab";
import RedeemTab from "../components/RedeemTab";

export default {
  async asyncData({ $axios }) {
    try {
      const user = await $axios.$get("/api/user");
      return { user };
    } catch (error) {
      return { user: null };
    }
  },
  data: function () {
    return {
      tokenProgress: null,
      tab: null,
    };
  }
};
</script>
