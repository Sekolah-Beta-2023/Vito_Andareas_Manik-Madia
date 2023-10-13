<script setup lang="ts">
import { FormSignUp } from "~/types/form";
const form = ref<FormSignUp>({
  email: "",
  password: "",
});

const { $toast } = useNuxtApp();

const client = useSupabaseClient();

const router = useRouter();

const errorSignin = ref<string>("");

const isLoading = ref<boolean>(false);

const onSignInPress = async () => {
  try {
    isLoading.value = true;
    let { error } = await client.auth.signInWithPassword({
      email: form.value.email,
      password: form.value.password,
    });

    if (error) {
      errorSignin.value = error.message;
    } else {
      $toast.success("Successfully signed in 🫡", {
        position: "bottom-right",
        duration: 120000,
        dismissible: true,
      });
      router.push("/app");
    }
  } catch (error) {
    throw error;
  } finally {
    isLoading.value = false;
  }
};

definePageMeta({
  layout: "auth",
});
</script>

<template>
  <div class="flex w-full max-w-7xl mx-auto">
    <div class="flex-1 hidden md:block"></div>
    <div
      class="flex-1 w-full h-screen flex justify-center px-3 md:px-8 flex-col"
    >
      <h1
        class="font-bold text-5xl text-white mx-auto mb-4"
        data-aos="zoom-in-out"
      >
        Sign<span class="font-bold text-5xl text-green-500">in</span>
      </h1>
      <form
        class="w-full max-w-[calc(1280px*80/100)] mx-auto inline-block"
        @submit.prevent="onSignInPress"
      >
        <div class="mb-6">
          <label for="email" class="block mb-2 text-sm font-medium text-white"
            >Your email</label
          >
          <input
            type="email"
            id="email"
            class="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
            placeholder="name@flowbite.com"
            v-model="form.email"
            required
          />
        </div>
        <div class="mb-4">
          <label
            for="password"
            class="block mb-2 text-sm font-medium text-white"
            >Your password</label
          >
          <input
            type="password"
            id="password"
            class="border mb-3 text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
            required
            v-model="form.password"
          />
          <div class="flex flex-col space-y-2">
            <span class="py-1 text-slate-300 text-sm"
              >Don't have an account yet?
              <nuxt-link to="/auth/signup" class="text-blue-500"
                >signup</nuxt-link
              >
              now.
            </span>
            <span
              class="px-4 py-1 bg-yellow-400/20 text-slate-300 rounded-md text-sm max-w-fit"
              v-if="!!errorSignin"
              >⚠️ Something went wrong, Please check your credentials.</span
            >
          </div>
        </div>

        <button
          v-if="!isLoading"
          type="submit"
          class="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800"
        >
          Signin
        </button>
        <UIButtonLoading v-else />
      </form>
    </div>
  </div>
</template>
