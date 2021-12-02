<template>
  <v-row>
    <v-col cols="12" class="auth">
      <v-form ref="form" v-model="valid" lazy-validation class="auth__form">
        <v-avatar size="150" class="auth__form-avatar">
          <img src="@/assets/images/avatar.png" alt="" srcset="" />
        </v-avatar>

        <h2 class="auth__form-header">REGISTER</h2>

        <v-text-field
          v-model="firstname"
          :rules="[rules.required]"
          label="First name"
          required
          placeholder="Enter your first name..."
          class="auth__form-input"
        ></v-text-field>

        <v-text-field
          v-model="lastname"
          :rules="[rules.required]"
          label="Last name"
          required
          placeholder="Enter your last name..."
          class="auth__form-input"
        ></v-text-field>

        <v-text-field
          v-model="email"
          :rules="[rules.required, rules.email]"
          label="E-Mail"
          required
          placeholder="Enter you email..."
          class="auth__form-input"
        ></v-text-field>

        <v-text-field v-model="birth" :rules="[rules.required]" label="Birth's day" type="date" required class="auth__form-input"></v-text-field>

        <v-autocomplete
          ref="country"
          v-model="gender"
          :rules="[rules.required]"
          :items="genders"
          label="Gender"
          placeholder="Select your gender..."
          required
        ></v-autocomplete>

        <v-text-field
          v-model="address"
          :rules="[rules.required]"
          label="Address"
          required
          placeholder="Enter your address..."
          class="auth__form-input"
        ></v-text-field>

        <v-text-field
          v-model="password"
          :rules="[rules.required, rules.min]"
          label="Password"
          required
          placeholder="Enter your password..."
          :append-icon="showp ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showp ? 'text' : 'password'"
          class="auth__form-input"
          @click:append="showp = !showp"
        ></v-text-field>

        <v-text-field
          v-model="repassword"
          :rules="[rules.required, rules.min, (v) => v === password || 'Confirm password must be same to password']"
          label="Confirm password"
          required
          placeholder="Confirm your password..."
          :append-icon="showrp ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showrp ? 'text' : 'password'"
          class="auth__form-input"
          @click:append="showrp = !showrp"
        ></v-text-field>

        <v-btn :disabled="!valid" :loading="loading" color="primary" block rounded type="submit" class="auth__form-btn" @click="validate">
          register
        </v-btn>

        <div class="auth__form-link">
          <span @click="$router.push('/auth/login')">Have an account!</span>
        </div>
      </v-form>
      <v-snackbar v-model="snackbarFail" color="error" outlined>
        {{ error }}
        <template #action="{ attrs }">
          <v-btn color="red" text v-bind="attrs" @click="snackbarFail = false"> Close </v-btn>
        </template>
      </v-snackbar>
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: 'auth',

  data: () => ({
    valid: true,
    error: '',
    loading: false,
    snackbarFail: false,
    showp: false,
    showrp: false,
    firstname: '',
    lastname: '',
    email: '',
    birth: '',
    gender: '',
    genders: ['Male', 'Female', 'Other'],
    address: '',
    password: '',
    repassword: '',
    rules: {
      required: (v) => !!v || 'Required.',
      min: (v) => v.length >= 8 || 'Password must be at least 8 characters',
      email: (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    },
  }),

  methods: {
    async validate(e) {
      e.preventDefault()
      if (this.$refs.form.validate()) {
        const data = {
          firstname: this.firstname,
          lastname: this.lastname,
          birth: this.birth,
          gender: this.gender,
          email: this.email,
          password: this.password,
          address: this.address,
        }
        this.loading = true
        const result = await this.$axios.post('/api/auth/register', data)
        if (result.data.success) {
          this.loading = false
          this.error = ''
          this.$auth.loginWith('local', {
            data: {
              email: this.email,
              password: this.password,
            },
          })
        } else {
          switch (result.data.status) {
            case 400:
              this.loading = false
              this.error = 'Your information is invalid!'
              this.snackbarFail = true
              break
            case 409:
              this.loading = false
              this.error = 'Email already exists!'
              this.snackbarFail = true
              break
            default:
              this.loading = false
              this.error = 'Server error!'
              this.snackbarFail = true
              break
          }
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/layouts/auth.scss';
</style>
