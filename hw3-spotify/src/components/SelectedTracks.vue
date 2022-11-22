<script setup>
import { ref, defineProps, computed } from "vue";

const props = defineProps(["selectedTracks"]);
const sortBy = ref("popularity");
const tracks = computed(() => {
  return props.selectedTracks.sort((a, b) => {
    if (["track_genre", "artists", "track_name"].includes(sortBy.value)) {
      return a[sortBy.value] < b[sortBy.value] ? -1 : 1;
    }
    return b[sortBy.value] - a[sortBy.value];
  });
});
const columns = [
  { key: "track_genre", label: "Genre" },
  { key: "artists", label: "Artists" },
  { key: "track_name", label: "Track" },
  { key: "popularity", label: "Popularity" },
  { key: "duration_ms", label: "Duration" },
  { key: "danceability", label: "Danceability" },
  { key: "energy", label: "Energy" },
  { key: "loudness", label: "Loudness" },
  { key: "speechiness", label: "Speechineess" },
  { key: "acousticness", label: "Acousticness" },
  { key: "instrumentalness", label: "Instrumentalness" },
  { key: "liveness", label: "Liveness" },
  { key: "valence", label: "Valence" },
  { key: "tempo", label: "Tempo" },
];
</script>

<template>
  <div class="h-1/3 w-full px-4 text-xs overflow-y-scroll scrollbar-thumb-accent scrollbar-thin">
    <table class="table-fixed">
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            class="px-1 text-left cursor-pointer"
            @click="sortBy = col.key"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="track in tracks" :key="track.track_id" class="hover:bg-zinc-700">
          <td v-for="col in columns" :key="`${track.track_id}-${col.key}`" class="px-1">
            {{ track[col.key] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
