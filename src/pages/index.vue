<script setup lang="ts">
import type { AuthError } from '@supabase/supabase-js'

defineOptions({
  name: 'IndexPage',
})

const supabase = useSupabase()
const router = useRouter()
const email = $ref('')
const password = $ref('')

const type = ref('login')
const handleLogin = async () => {
  try {
    const {
      error,
      data: { user },
    }
      = type.value === 'login'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })
    // If the user doesn't exist here and an error hasn't been raised yet,
    // that must mean that a confirmation email has been sent.
    // NOTE: Confirming your email address is required by default.
    if (error) {
      throw error
    }
    else if (!user) {
      useNotify({
        title: 'Success',
        text: 'Signup successful, confirmation mail should be sent soon!',
        type: 'success',
      })
    }
    else {
      useNotify({
        title: 'Success',
        text: 'Login successful!',
        type: 'success',
      })

      router.push('/channels/1')
    }
  }
  catch (error) {
    useNotify({
      title: 'Error',
      text: `Error with auth: ${(error as AuthError).message}`,
      type: 'error',
    })
  }
}

const toggleTypeForm = () =>
  type.value === 'create' ? (type.value = 'login') : (type.value = 'create')
</script>

<template>
  <div
    class="h-screen min-h-full flex items-center justify-center px-4 py-12 lg:px-8 sm:px-6"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <img
          class="mx-auto h-12 w-auto"
          src="/favicon.svg"
          alt="MessengerX"
        >
        <h2
          class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
          {{
            type === "login" ? "Sign in to your account" : "Create your account"
          }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-light-400">
          Or
          {{ " " }}
          <a
            href="#"
            class="cursor-pointer font-medium text-green-600 hover:text-green-500"
            @click="toggleTypeForm"
          >
            {{
              type === "login"
                ? "create a new account"
                : "sign in to your account"
            }}
          </a>
        </p>
      </div>
      <form
        class="mt-8 space-y-6"
        @submit.prevent="handleLogin"
      >
        <input
          type="hidden"
          name="remember"
          value="true"
        >
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label
              for="email-address"
              class="sr-only"
            >Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="relative block w-full border-0 rounded-t-md py-1.5 text-gray-900 ring-1 ring-gray-300 ring-inset focus:z-10 sm:text-sm sm:leading-6 placeholder:text-gray-400 focus:ring-2 focus:ring-green-600 focus:ring-inset"
              placeholder="Email address"
              @change="email = ($event.target as HTMLInputElement).value"
            >
          </div>
          <div>
            <label
              for="password"
              class="sr-only"
            >Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="relative block w-full border-0 rounded-b-md py-1.5 text-gray-900 ring-1 ring-gray-300 ring-inset focus:z-10 sm:text-sm sm:leading-6 placeholder:text-gray-400 focus:ring-2 focus:ring-green-600 focus:ring-inset"
              placeholder="Password"
              @change="password = ($event.target as HTMLInputElement).value"
            >
          </div>
        </div>

        <div
          v-if="type === 'login'"
          class="w-full flex items-center justify-between"
        >
          <div class="ml-auto text-sm">
            <a
              href="#"
              class="font-medium text-green-600 hover:text-green-500"
            >
              Forgot your password?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-green-600 focus-visible:outline-offset-2 focus-visible:outline"
          >
            <span class="absolute inset-y-0 left-0 flex items-center pl-3" />
            {{ type === "login" ? "Sign in" : "Create account" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
