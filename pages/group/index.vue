<template>
  <div class="home">
    <v-container>
      <v-row class="home-row">
        <v-col cols="3" md="3" class="listMembers d-none d-md-flex">
          <groups-component ref="create_gr" :group="true" @handleSelected="handleSelected" />
        </v-col>
        <v-col xl="6" md="9" sm="12" class="posts">
          <group-component v-if="getGroup !== null" :group="getGroup" @refreshSelected="refreshSelected" />
          <div v-if="getGroup === null" class="none">
            <div class="none-header">
              <v-btn color="primary" @click="handleCreateGroup">Create new group</v-btn>
            </div>
            <v-divider></v-divider>
            <div class="none-body">
              <div class="header">
                <span>Suggestions</span>
                <v-divider></v-divider>
              </div>
              <div class="body">
                <v-list subheader>
                  <v-list-item-group>
                    <v-list-item v-for="(item, i) in getAllGroup" :key="i" @click="$router.push(`/group/${item._id}`)">
                      <v-list-item-avatar>
                        <img :src="item.background === null ? $store.state.bgDefault : item.background.imgUrl" alt="" srcset="" />
                      </v-list-item-avatar>

                      <v-list-item-content class="body-name">
                        <v-list-item-title>{{ item.name }}</v-list-item-title>
                      </v-list-item-content>

                      <v-list-item-icon>
                        <v-icon class="body-icon">mdi-view-dashboard-outline</v-icon>
                      </v-list-item-icon>

                      <v-list-item-action>
                        <v-btn color="primary" @click="handleJoin($event, item._id)">Join</v-btn>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </div>
            </div>
          </div>
        </v-col>
        <v-col cols="3" class="groups d-none d-xl-flex">
          <members-component v-if="getGroup !== null" :members="getGroup.members" :admin="getGroup.admin" />
        </v-col>
      </v-row>
    </v-container>
    <!-- Amination -->
    <v-snackbar v-model="snackbarSuccess" color="success" outlined>
      Leave successfully!
      <template #action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbarSuccess = false"> Close </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar v-model="snackbarFail" color="error" outlined>
      Something went wrong!
      <template #action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbarFail = false"> Close </v-btn>
      </template>
    </v-snackbar>

    <!-- Overlay -->
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import GroupsComponent from '@/components/home/Groups.vue'
import GroupComponent from '@/components/group/Group.vue'
import MembersComponent from '@/components/group/Members.vue'

export default {
  components: {
    GroupsComponent,
    GroupComponent,
    MembersComponent,
  },

  data: () => ({
    selected: 0,
    allGroup: [],
    snackbarSuccess: false,
    snackbarFail: false,
    overlay: false,
  }),

  computed: {
    getGroup(ctx) {
      if (ctx.$store.state.user && ctx.$store.state.user.groups.length > 0) {
        return ctx.$store.state.user.groups[ctx.selected]
      } else {
        return null
      }
    },
    getAllGroup(ctx) {
      return ctx.allGroup
    },
  },

  mounted() {
    try {
      this.$axios.get('/api/group').then((respone) => {
        if (respone.data.success) {
          this.allGroup = respone.data.groups
        } else {
          this.allGroup = []
        }
      })
    } catch (error) {
      this.allGroup = []
    }
  },

  methods: {
    handleSelected(data) {
      this.selected = data
      try {
        this.$axios.get('/api/group').then((respone) => {
          if (respone.data.success) {
            this.allGroup = respone.data.groups
          } else {
            this.allGroup = []
          }
        })
      } catch (error) {
        this.allGroup = []
      }
    },
    refreshSelected() {
      this.selected = 0
    },
    async handleJoin(e, id) {
      e.stopPropagation()
      try {
        this.overlay = true
        const result = await this.$axios.put(`/api/group/join`, { user: this.$auth.user._id, group: id })
        if (result.data.success) {
          await this.$auth.fetchUser()
          await this.$store.commit('setUser', this.$auth.user)
          this.overlay = false
        } else {
          this.overlay = false
          this.snackbarFail = true
        }
      } catch (error) {
        this.overlay = false
        this.snackbarFail = true
      }
    },
    handleCreateGroup() {
      this.$refs.create_gr.dialog = true
    },
  },
}
</script>

<style lang="scss" scoped>
.home {
  position: relative;
  background: $secondary;
  width: 100%;
  height: 100%;
  .container {
    position: relative;
    height: 100%;
    width: 100%;
    .home-row {
      position: relative;
      height: 100%;
      width: 100%;
      margin: 0;
      .listMembers {
        position: relative;
        padding: 0;
        width: 100%;
        height: 100%;
        border-radius: 10px;
        flex-direction: column;
        overflow: hidden;
      }
      .posts {
        position: relative;
        padding: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        align-items: center;
        .none {
          width: 95%;
          height: 100%;
          background: #fff;
          border-radius: 10px;
          overflow: hidden;
          &-header {
            width: 95%;
            height: 50px;
            margin: 0 auto;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          &-body {
            height: calc(100% - 30px);
            width: 95%;
            margin: 0 auto;
            position: relative;
            .header {
              position: relative;
              width: 100%;
              height: 40px;
              overflow: hidden;
              span {
                color: $primary;
                font-weight: 600;
              }
            }
            .body {
              width: 100%;
              height: calc(100% - 50px);
              overflow-y: auto;
              &::-webkit-scrollbar {
                width: 6px;
                background: $secondary;
                border-radius: 30px;
              }
              &::-webkit-scrollbar-thumb {
                background: $primary;
                border-radius: 30px;
              }
              &-name {
                font-weight: 500;
              }
              &-icon {
                cursor: pointer;
                &:hover {
                  color: $primary;
                }
              }
            }
          }
        }
      }
      .groups {
        background: none;
        padding: 0;
        border-radius: 10px;
        overflow: hidden;
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
