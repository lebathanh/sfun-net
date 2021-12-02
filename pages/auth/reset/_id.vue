<template>
  <v-row>
    <v-col cols="12" class="auth">
      <v-form ref="form" v-model="valid" lazy-validation class="auth__form">
        <v-avatar size="150" class="auth__form-avatar">
          <img src="@/assets/images/avatar.png" alt="" srcset="" />
        </v-avatar>

        <h2 class="auth__form-header">RESET</h2>

        <v-text-field
          v-model="password"
          :rules="passwordRules"
          label="Password"
          required
          placeholder="Enter your password..."
          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show ? 'text' : 'password'"
          class="auth__form-input"
          @click:append="show = !show"
        ></v-text-field>

        <v-text-field
          v-model="repassword"
          :rules="[passwordRules, () => repassword === password || 'Confirm password must be same to password']"
          label="Confirm password"
          required
          placeholder="Confirm your password..."
          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show ? 'text' : 'password'"
          class="auth__form-input"
          @click:append="show = !show"
        ></v-text-field>

        <v-btn :disabled="!valid" :loading="loading" color="primary" block rounded type="submit" class="auth__form-btn" @click="validate"> save </v-btn>

        <div class="auth__form-link">
          <span @click="$router.push('/auth/login')">Go to login page</span>
          <span @click="$router.push('/auth/register')">Register</span>
        </div>
      </v-form>
    </v-col>
    <v-snackbar v-model="snackbarSuccess" color="success" outlined>
      Password updated, go login page after 3s!
      <template #action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbarSuccess = false"> Close </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar v-model="snackbarFail" color="error" outlined>
      Link exprired!
      <template #action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbarFail = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-row>
</template>

<script>
export default {
  layout: 'auth',

  data: () => ({
    loading: false,
    snackbarFail: false,
    snackbarSuccess: false,
    show: false,
    valid: true,
    password: '',
    repassword: '',
    passwordRules: [(v) => !!v || 'Is required', (v) => (v && v.length >= 8) || 'Must be at least 8 characters'],
  }),

  methods: {
    async validate(e) {
      e.preventDefault()
      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          const result = await this.$axios.$put(
            '/api/auth/reset',
            {
              password: this.password,
            },
            {
              headers: {
                Authorization: 'Bearer ' + this.$route.params.id,
              },
            }
          )
          if (result.success) {
            this.loading = false
            this.snackbarSuccess = true
            setTimeout(() => {
              this.$router.push('/auth/login')
            }, 3000)
          } else {
            this.loading = false
            this.snackbarFail = true
          }
        } catch (error) {
          this.success = false
          this.snackbarFail = true
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/layouts/auth.scss';
</style>
