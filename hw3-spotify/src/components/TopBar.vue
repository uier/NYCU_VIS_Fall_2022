<script setup>
import { defineProps } from "vue";

const { stats } = defineProps(["stats"]);
</script>

<template>
  <div class="flex h-24 items-center">
    <div class="py-2 pl-6 flex justify-center items-center h-full">
      <span class="text-3xl font-bold">Spotify Tracks</span>
    </div>
    <div class="flex-1 stats shadow">
      <div class="stat place-items-center">
        <div class="stat-title">Tracks</div>
        <div class="stat-value">{{ stats.numTracks }}</div>
      </div>

      <div class="stat place-items-center">
        <div class="stat-title">Genre</div>
        <div class="stat-value">{{ stats.numGenres }}</div>
      </div>

      <div class="stat place-items-center">
        <div class="stat-title">Artists</div>
        <div class="stat-value">{{ stats.numArtists }}</div>
      </div>

      <div class="stat place-items-center">
        <div class="stat-title">Album</div>
        <div class="stat-value">{{ stats.numAlbums }}</div>
      </div>
    </div>
  </div>
</template>
