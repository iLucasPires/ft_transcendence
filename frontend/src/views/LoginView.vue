<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";

const type = ref("signup");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const handleSubmit = () => {
  if (type.value === "login") {
    // login
  }
  if (type.value === "signup") {
    // signup
  }
};
</script>

<template>
  <div class="hero min-h-screen bg-base-200 w-full justify-center">
    <div class="hero-content flex-col lg:flex-row-reverse w-screen">
      <div class="card w-full max-w-md md:shadow-2xl md:bg-base-100">
        <div class="card-body w-full">
          <h1 class="mb-5 text-4xl font-bold">
            {{ type === "signin" ? "Sign in" : "Sign up" }}
          </h1>
          <form @submit.prevent="handleSubmit" class="">
            <div class="form-control">
              <input
                v-model="email"
                type="email"
                placeholder="email"
                class="input input-bordered mb-4"
                required
              />
            </div>
            <div class="form-control">
              <input
                v-model="password"
                type="password"
                placeholder="password"
                class="input input-bordered mb-4"
                required
              />
            </div>
            <RouterLink
              v-if="type === 'signin'"
              to="#"
              class="label label-text-alt link link-hover"
              >Forgot password?</RouterLink
            >

            <div v-else>
              <div class="form-control">
                <input
                  v-model="confirmPassword"
                  type="password"
                  placeholder="password again"
                  class="input input-bordered mb-4"
                  required
                />
              </div>
              <p class="text-xs text-gray-500 text-center mt-3">
                By signing up, you agree to our Terms
                <br />
                <RouterLink to="#" class="label-text-alt link link-hover"
                  >Terms of Service</RouterLink
                >
                &nbsp;and&nbsp;
                <RouterLink to="#" class="label-text-alt link link-hover"
                  >Privacy Policy</RouterLink
                >
              </p>
            </div>

            <div class="form-control mt-6">
              <button class="btn btn-primary">{{ type }}</button>
            </div>
          </form>
          <div class="form-control">
            <div class="join w-full">
              <button class="btn btn-neutral w-1/2 join-item">42 Intra</button>
              <button class="btn btn-success w-1/2 join-item">Google</button>
            </div>
            <label class="label">
              <button
                class="label-text-alt link link-hover"
                @click="() => (type = type === 'signin' ? 'signup' : 'signin')"
              >
                {{
                  type === "signin"
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Sign in"
                }}
              </button>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
