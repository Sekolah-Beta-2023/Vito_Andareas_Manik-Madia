<template>
  <div class="dark:bg-zinc-900 text-white-rounded-lg">
    <div class="flex flex-col">
      <!-- cover image -->
      <div class="w-full max-h-[350px] overflow-hidden" v-if="coverImgUrl">
        <NuxtImg
          :src="props.coverImgUrl"
          class="object-cover w-full rounded-lg"
        />
      </div>
      <!-- header blog -->
      <div class="p-6 space-y-2">
        <div class="flex items-center space-x-3">
          <div>
            <NuxtImg
              :src="avatarImgUrl"
              class="rounded-full w-[40px] h-[40px] object-cover"
            />
          </div>
          <div class="leading-[17px]">
            <h3 class="text-xl">{{ props.name }}</h3>
            <small class="text-slate-300">{{ createdAt }}</small>
          </div>
        </div>

        <!-- content blog -->
        <div class="md:px-[52px]">
          <h1 class="text-3xl md:text-5xl font-bold">
            {{ props.titlePosts }}
          </h1>
          <!-- tag -->
          <div class="flex space-x-4 text-slate-300 mb-2">
            <small
              class="text-base items-center font-medium italic"
              v-if="props.tagPosts"
              v-for="tag in (props.tagPosts as RowTags[])"
              :key="tag.id"
            >
              <div class="inline" :style="{ color: tag.color }">#</div>
              {{ tag.tag }}</small
            >
          </div>
          <MdPreview
            :model-value="props.descriptions"
            :theme="'dark'"
            style="background-color: #18181b; color: white"
            :language="'en-US'"
            preview-theme="vuepress"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MdPreview } from "md-editor-v3";

import "md-editor-v3/lib/preview.css";
import { RowTags } from "~/types/tags";

const props = defineProps({
  coverImgUrl: {
    type: String,
  },
  avatarImgUrl: {
    type: String,
    default: "https://placehold.co/40",
  },
  name: {
    type: String,
    required: true,
  },
  titlePosts: {
    type: String,
    required: true,
  },
  tagPosts: {},
  reactionPosts: {
    type: Number,
    default: 0,
  },
  viewsPosts: {
    type: Number,
    default: 0,
  },
  descriptions: {
    type: String,
  },
  createdAt: {
    type: String,
  },
  post_id: {
    type: Number,
  },
});
</script>
