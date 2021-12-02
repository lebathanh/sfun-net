<template>
  <div class="body_page">
    <div class="body_page-header">
      <h2>This page is not available</h2>
      <p>Please check your address or go back home page to continue...</p>
      <v-btn color="primary" @click="$router.push('/')">Go home</v-btn>
    </div>
    <img src="@/assets/images/404.gif" alt="" srcset="" />
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.body_page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  &-header {
    position: fixed;
    width: 100%;
    text-align: center;
    margin-top: 150px;
    top: 0px;
    h2 {
      font-size: 30px;
      text-transform: uppercase;
    }
  }
  img {
    margin-top: 150px;
  }
}
</style>
