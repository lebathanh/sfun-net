<template>
  <v-app>
    <v-main class="main">
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'Auth',

  middleware: 'auth-login',

  beforeCreate(){
    if(this.$auth.loggedIn){
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  background: $bg;
  width: 100%;
  height: 100%;
  position: relative;
  .container {
    position: relative;
    padding: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
