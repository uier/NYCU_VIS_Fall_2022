<script setup>
import { defineProps } from "vue";
import { format } from "d3";

const { stats } = defineProps(["stats"]);
</script>

<template>
  <div class="flex h-24 items-center">
    <div class="py-2 flex items-center h-full">
      <span class="text-3xl text-primary font-bold">Spotify Tracks</span>
    </div>
    <div class="flex-1 stats shadow">
      <div class="stat place-items-center">
        <div class="stat-title font-semibold opacity-80">Tracks</div>
        <div class="stat-value text-3xl text-secondary">{{ format("~s")(stats.numTracks) }}</div>
      </div>

      <div class="stat place-items-center">
        <div class="stat-title font-semibold opacity-80">Genre</div>
        <div class="stat-value text-3xl text-secondary">{{ format("~s")(stats.numGenres) }}</div>
      </div>

      <div class="stat place-items-center">
        <div class="stat-title font-semibold opacity-80">Artists</div>
        <div class="stat-value text-3xl text-secondary">{{ format("~s")(stats.numArtists) }}</div>
      </div>

      <div class="stat place-items-center">
        <div class="stat-title font-semibold opacity-80">Album</div>
        <div class="stat-value text-3xl text-secondary">{{ format("~s")(stats.numAlbums) }}</div>
      </div>
    </div>
  </div>
</template>
