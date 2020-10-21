<template>
  <div style="width: 100%">
    <center>
      <v-progress-circular indeterminate size="200"/>
    </center>
  </div>
</template>

<script>
import axios from "axios"

export default {
  async mounted() {
    const token = localStorage.getItem('session-token')
    try {
      const resp = await axios.post(`/api/request-commit/${token}`)
      localStorage.removeItem('session-token')
    } catch (error) {
      console.error(error)
    }
    this.$router.push("/")
  },
}
</script>