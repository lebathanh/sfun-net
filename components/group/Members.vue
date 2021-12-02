<template>
  <div class="body">
    <v-card class="group">
      <v-list subheader class="group-list">
        <v-subheader class="group-list__header">
          <span>Members - {{ members.length }}</span>
          <v-spacer></v-spacer>
          <v-icon v-if="!gShow" color="white" @click="gShow = true"> mdi-chevron-down </v-icon>
          <v-icon v-if="gShow" color="white" @click="gShow = false"> mdi-chevron-up </v-icon>
        </v-subheader>
        <div v-if="gShow" class="group-list__content">
          <v-list-item-group>
            <v-list-item v-for="(item, i) in members" :key="i" @click="$router.push(`/user/${item._id}`)">
              <v-list-item-avatar>
                <v-img :src="item.avatar === null ? $store.state.avatarDefault : item.avatar.imgUrl"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-text="`${item.lastname} ${item.firstname}`"></v-list-item-title>
              </v-list-item-content>

              <v-list-item-icon class="group-list__content-icon">
                <span v-if="item._id !== admin._id">Member</span>
                <v-icon v-if="item._id !== admin._id" color="primary">mdi-account</v-icon>

                <span v-if="item._id === admin._id">Admin</span>
                <v-icon v-if="item._id === admin._id" color="warning">mdi-shield-key </v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-item-group>
        </div>
      </v-list>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    members: {
      type: [Object, Boolean, Array, String],
      default: () => {},
    },
    admin: {
      type: [Object, Boolean, Array, String],
      default: () => {},
    },
  },

  data: () => ({
    gShow: true,
  }),
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/components/list_group.scss';
</style>
