<script setup lang="ts">
import { useSupabase } from "~/composables/supabase";

defineOptions({
  name: "IndexPage",
});
// const user = useUserStore()
const supabase = useSupabase();
const router = useRouter();
// const email = $ref(user.savedName)
const email = $ref("");
const password = $ref("");

const type = ref("login");
const handleLogin = async () => {
  try {
    const {
      error,
      data: { user },
    } =
      type.value === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
    // If the user doesn't exist here and an error hasn't been raised yet,
    // that must mean that a confirmation email has been sent.
    // NOTE: Confirming your email address is required by default.
    if (error) {
      useNotify({
        title: "Error",
        text: `Error with auth: ${error.message}`,
        type: "error",
      });
    } else if (!user) {
      useNotify({
        title: "Success",
        text: "Signup successful, confirmation mail should be sent soon!",
        type: "success",
      });
    } else {
      useNotify({
        title: "Success",
        text: "Login successful!",
        type: "success",
      });

      router.push("/channels/1");
    }
  } catch (error) {
    // console.log('error', error)
    useNotify({
      title: "Error",
      text: error?.error_description || error,
      type: "error",
    });
  }
};

const toggleTypeForm = () =>
  type.value === "create" ? (type.value = "login") : (type.value = "create");
// const { t } = useI18n()
</script>

<template>
  <div
    class="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8 h-screen"
  >
    <div class="w-full max-w-md space-y-8">
      <div>
        <img class="mx-auto h-12 w-auto" src="/favicon.svg" alt="MessengerX" />
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
            class="font-medium text-green-600 hover:text-green-500 cursor-pointer"
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
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <input type="hidden" name="remember" value="true" />
        <div class="-space-y-px rounded-md shadow-sm">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
              placeholder="Email address"
              @change="email = ($event.target as HTMLInputElement).value"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
              placeholder="Password"
              @change="password = ($event.target as HTMLInputElement).value"
            />
          </div>
        </div>

        <div
          v-if="type === 'login'"
          class="flex items-center justify-between w-full"
        >
          <div class="text-sm ml-auto">
            <a href="#" class="font-medium text-green-600 hover:text-green-500">
              Forgot your password?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative flex w-full justify-center rounded-md bg-green-600 py-2 px-3 text-sm font-semibold text-white hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
            </span>
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
