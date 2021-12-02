<template>
  <v-app>
    <!-- App bar -->
    <v-app-bar class="app_bar" height="50px" color="white" elevation="3" fixed app prominent>
      <!-- Pc -->
      <v-icon v-if="!mini && isMobile" class="app_bar-icon" @click="mini = !mini">mdi-menu</v-icon>
      <v-icon v-if="mini && isMobile" class="app_bar-icon" @click="mini = !mini">mdi-backburger</v-icon>
      <!-- Mobile -->
      <v-icon v-if="!drawer && !isMobile" class="app_bar-icon" @click="drawer = !drawer">mdi-menu</v-icon>
      <v-icon v-if="drawer && !isMobile" class="app_bar-icon" @click="drawer = !drawer">mdi-backburger</v-icon>

      <div class="app_bar-name">
        <p>Sfun</p>
      </div>

      <v-spacer></v-spacer>

      <!-- Seach bar -->
      <v-menu offset-y>
        <template #activator="{ on, attrs }">
          <div class="app_bar-search">
            <input
              ref="s_input"
              v-model="search"
              type="text"
              :class="{
                'app_bar-search_input': true,
                hide_mobile: !isShowInput,
              }"
              v-bind="attrs"
              placeholder="Search here..."
              v-on="on"
              @blur="blurSearch"
            />
            <v-icon class="app_bar-search_icon" color="primary" size="28" @click="showInput">mdi-magnify</v-icon>
          </div>
        </template>
        <v-subheader class="z-index">Results ({{ getFilteredItems.length }})</v-subheader>
        <v-divider></v-divider>
        <v-list v-if="search !== ''">
          <v-list-item v-for="(item, index) in getFilteredItems" :key="index" @click="clickItemSearch($event, item)">
            <v-list-item-avatar>
              <img v-if="item.type === 'user'" :src="item.data.avatar === null ? $store.state.avatarDefault : item.data.avatar.imgUrl" />
              <img v-if="item.type === 'group'" :src="item.data.background === null ? $store.state.bgDefault : item.data.background.imgUrl" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-subtitle v-if="item.type === 'user'">{{ `${item.data.lastname} ${item.data.firstname}` }} </v-list-item-subtitle>
              <v-list-item-subtitle v-if="item.type === 'group'">{{ item.data.name }} </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- Notification -->
      <v-menu transition="slide-y-transition" offset-y bottom>
        <template #activator="{ on, attrs }">
          <div class="app_bar-notifi">
            <v-badge :content="getNotifi.length" :value="getNotifi.length" color="red" overlap>
              <v-icon class="app_bar-notifi_icon" v-bind="attrs" size="28" v-on="on"> mdi-bell </v-icon>
            </v-badge>
          </div>
        </template>
        <v-list>
          <v-list-item-group class="drop_notifi">
            <v-subheader class="drop_notifi-header"> Notifications </v-subheader>
            <v-divider></v-divider>
            <notifi-component v-for="(item, i) in getNotifi" :key="i" :item="item" />
          </v-list-item-group>
        </v-list>
      </v-menu>

      <div class="app_bar-lang">
        <select>
          <option value="ENG">EN</option>
          <option value="ENG">VI</option>
        </select>
      </div>

      <v-avatar class="ml-1 app_bar-logo" size="40">
        <img src="@/assets/images/icon.png" />
      </v-avatar>
    </v-app-bar>

    <!-- Nav bar -->
    <v-navigation-drawer v-model="drawer" :mini-variant="isMini" :permanent="isMobile" class="nav_bar" absolute app>
      <v-list-item class="px-2 nav_bar-user">
        <v-list-item-avatar>
          <v-img :src="getAvatar"></v-img>
        </v-list-item-avatar>

        <v-list-item-title class="nav_bar-user_name">{{ getName }}</v-list-item-title>
      </v-list-item>

      <v-list dense class="nav_bar-item">
        <v-list-item-group v-model="model">
          <v-list-item v-for="(item, i) in items" :key="i" link class="nav_bar-item_" :to="`/${item.link}`">
            <v-list-item-icon>
              <v-icon class="nav_bar-item__icon">{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="nav_bar-item__title">{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <!-- Logout -->
          <v-list-item class="nav_bar-item_" @click="logOut">
            <v-list-item-icon>
              <v-icon class="nav_bar-item__icon">mdi-logout</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="nav_bar-item__title">Log out</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <!-- Main -->
    <v-main class="content">
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
import Vue from 'vue'
import NotifiComponent from '@/components/layout/Notification.vue'

export default {
  name: 'Home',

  components: {
    NotifiComponent,
  },

  middleware: 'auth-user',

  data: () => ({
    drawer: false,
    mini: false,
    search: '',
    filteredItems: [],
    show: false,
    model: 0,
    items: [
      { title: 'Home', icon: 'mdi-home-city', link: '' },
      { title: 'Groups', icon: 'mdi-account-group-outline', link: 'group' },
      { title: 'My Account', icon: 'mdi-account', link: 'user' },
    ],
  }),

  computed: {
    isMobile: (ctx) => {
      if (ctx.$vuetify.breakpoint.width >= 741) {
        return true
      } else {
        return false
      }
    },
    isMini: (ctx) => {
      if (ctx.$vuetify.breakpoint.width >= 741) {
        return !ctx.mini
      } else {
        return ctx.mini
      }
    },
    isShowInput: (ctx) => {
      return ctx.show
    },
    getAvatar: (ctx) => {
      if (ctx.$store.state.user !== null) {
        return ctx.$store.state.user.avatar === null ? ctx.$store.state.avatarDefault : ctx.$store.state.user.avatar.imgUrl
      } else {
        return ctx.$store.state.avatarDefault
      }
    },
    getName: (ctx) => {
      if (ctx.$store.state.user !== null) {
        return `${ctx.$store.state.user.lastname} ${ctx.$store.state.user.firstname}`
      } else {
        return `No Name`
      }
    },
    getNotifi: (ctx) => {
      if (ctx.$store.state.user) {
        return ctx.$store.state.user.notifications
      } else {
        return []
      }
    },
    getSearchText: (ctx) => {
      return ctx.search.length
    },
    getFilteredItems: (ctx) => {
      return ctx.filteredItems
    },
  },

  watch: {
    getSearchText() {
      if (this.getSearchText > 0) {
        ;(async () => {
          try {
            const result = await this.$axios.get(`/api/auth/search/${this.search}`)
            this.filteredItems = result.data.items
          } catch (error) {
            this.filteredItems = []
          }
        })()
      } else {
        this.filteredItems = []
      }
    },
  },

  beforeCreate() {
    if (this.$auth.loggedIn) {
      this.$store.commit('setUser', this.$auth.user)
      Vue.prototype.socket = this.$nuxtSocket({
        reconection: false,
        query: {
          _id: this.$auth.user._id,
        },
      })
    }
  },

  mounted() {
    this.socket.on(`srv_newpost-${this.$auth.user._id}`, (data) => {
      this.$store.commit('addNotification', data)
    })
  },

  methods: {
    showInput() {
      this.show = !this.show
      this.$nextTick(() => {
        this.$refs.s_input.focus()
        this.$refs.s_input.click()
      })
    },
    blurSearch() {
      this.show = false
    },
    async logOut() {
      await this.$auth.logout()
      this.$router.push('/auth/login')
    },
    clickItemSearch(e, data) {
      if (data.type === 'user') {
        this.$router.push(`/user/${data.data._id}`)
      } else {
        this.$router.push(`/group/${data.data._id}`)
      }
      this.search = ''
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/layouts/home.scss';
</style>
