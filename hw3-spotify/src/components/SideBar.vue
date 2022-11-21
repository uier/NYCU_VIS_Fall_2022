<script setup>
import { defineProps } from "vue";

const { genres } = defineProps(["genres"]);
</script>

<template>
  <div class="flex flex-col">
    <div v-for="genre in genres" :key="genre" class="border my-2">
      <span>{{ genre }}</span>
    </div>
  </div>
</template>
