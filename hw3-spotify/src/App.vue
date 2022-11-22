<script setup>
import { ref } from "vue";
import { useSpotify } from "./lib/useSpotify";
import TopBar from "./components/TopBar.vue";
import SideBar from "./components/SideBar.vue";
import LoadingIndicator from "./components/LoadingIndicator.vue";
import ParallelCoordinate from "./components/ParallelCoordinate.vue";
import SelectedTracks from "./components/SelectedTracks.vue";
import { watchDebounced } from "@vueuse/core";

const { isLoading, data, error, genres, stats } = useSpotify();
const selectedGenres = ref(["anime", "blues", "k-pop", "sleep", "study"]);
const selectedTracks = ref([]);

const debouncedSelectedGenre = ref(selectedGenres.value);
watchDebounced(
  selectedGenres,
  () => {
    debouncedSelectedGenre.value = selectedGenres.value;
  },
  { debounce: 500, maxWait: 1000 }
);
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
        <template v-else>
          <parallel-coordinate
            :key="debouncedSelectedGenre"
            :data="data"
            :selectedGenres="debouncedSelectedGenre"
            v-model="selectedTracks"
          />
          <selected-tracks :selectedTracks="selectedTracks" />
        </template>
      </div>
    </main>
    <footer class="w-full opacity-70 text-xs py-1 flex justify-between">
      <span class="italic"
        >hint: CHOOSE genres from sidebar and compare 2 ~ 10 genres by parallel coordinate. DATA can
        be filtered by brushing on axes. TABLE shows top 30 tracks active in coordinate.</span
      >
      <span>Spotify Tracks VIS by 311553005 于子緯</span>
    </footer>
  </div>
</template>
