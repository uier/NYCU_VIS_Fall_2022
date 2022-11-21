<script setup>
import { ref } from "vue";
import { useSpotify } from "./lib/useSpotify";
import TopBar from "./components/TopBar.vue";
import SideBar from "./components/SideBar.vue";
import LoadingIndicator from "./components/LoadingIndicator.vue";
import ParallelCoordinate from "./components/ParallelCoordinate.vue";

const { isLoading, data, error, genres, stats } = useSpotify();
const selectedGenres = ref(["anime", "blues", "k-pop", "sleep", "study"]);
</script>

<template>
  <div class="h-screen w-screen flex flex-col justify-between px-8">
    <top-bar :stats="stats" />
    <main class="flex-1 flex">
      <side-bar v-model="selectedGenres" :genres="genres" />
      <div class="flex-1 flex flex-col justify-center items-center">
        <loading-indicator v-if="isLoading" />
        <div v-else-if="error" class="alert alert-error w-1/2 flex-col">
          <div>Oops! something went wrong. please try again later.</div>
          <div>
            <details>
              <summary>Error message:</summary>
              <p>{{ error }}</p>
            </details>
          </div>
        </div>
        <parallel-coordinate
          v-else
          :key="selectedGenres"
          :data="data"
          :selectedGenres="selectedGenres"
        />
      </div>
    </main>
    <footer class="w-full opacity-70 text-xs py-1">Spotify Tracks VIS by 311553005 于子緯</footer>
  </div>
</template>
