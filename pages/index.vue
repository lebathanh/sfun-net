<template>
  <div class="home">
    <v-container>
      <v-row class="home-row">
        <v-col cols="3" md="3" class="friends d-none d-md-flex">
          <friends-component />
        </v-col>
        <v-col xl="6" md="9" sm="12" class="posts">
          <posts-component />
        </v-col>
        <v-col cols="3" class="groups d-none d-xl-flex">
          <groups-component />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import PostsComponent from '@/components/home/ListPost.vue'
import FriendsComponent from '@/components/home/Friends.vue'
import GroupsComponent from '@/components/home/Groups.vue'

export default {
  name: 'HomePage',
  components: {
    PostsComponent,
    FriendsComponent,
    GroupsComponent,
  },
  data: () => ({}),
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/pages/home.scss';
</style>
