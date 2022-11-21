<script setup>
import { useSpotify } from "./lib/useSpotify";
import TopBar from "./components/TopBar.vue";
import SideBar from "./components/SideBar.vue";
import LoadingIndicator from "./components/LoadingIndicator.vue";

const { isLoading, data, error, genres, stats } = useSpotify();
</script>

<template>
  <div class="h-screen w-screen flex flex-col justify-between px-8">
    <template v-if="isLoading">
      <loading-indicator />
    </template>
    <template v-else>
      <top-bar :stats="stats" />
      <main class="flex-1 pt-4 flex">
        <side-bar :genres="genres" />
        <div class="flex-1"></div>
      </main>
      <footer class="w-full text-sm">Spotify Tracks Visualization by 311553005 于子緯</footer>
    </template>
  </div>
</template>
