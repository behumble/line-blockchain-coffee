<template>
  <div class="d-flex flex-column align-center">
    <div class="">You have</div>
    <div class="text-h4">{{ amount }}</div>
  </div>
</template>

<script>
import accounting from "accounting";
import axios from "axios";

export default {
  mounted() {
    this.updateBalance()

    setInterval(() => {
      this.updateBalance()
    }, 1000)
  },
  data: function () {
    return {
      amount: 0,
    };
  },
  methods: {
    formatCurrency(amount) {
      return accounting.formatMoney(amount, {
        symbol: "LBCC",
        format: "%v %s",
        precision: 3,
      });
    },
    async updateBalance() {
      try {
        const resp = await axios.get("/api/coffee-coin");
        const fraction = Number(resp.data.responseData.amount);
        const value = fraction / 1000000;
        this.amount = this.formatCurrency(value);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>