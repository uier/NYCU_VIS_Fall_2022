<script setup>
import { defineProps } from "vue";

const { genres } = defineProps(["genres"]);
</script>

<template>
  <div class="flex flex-col">
    <span class="text-2xl font-semibold text-accent uppercase italic">Genre</span>
    <div class="max-h-[80vh] overflow-y-auto scrollbar-thumb-accent scrollbar-thin">
      <div v-for="genre in genres" :key="genre" class="p-1 border-l-4 border-primary my-2">
        <span>{{ genre }}</span>
      </div>
    </div>
  </div>
</template>
