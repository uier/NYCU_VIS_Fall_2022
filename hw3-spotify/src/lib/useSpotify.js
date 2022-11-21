import { onMounted, reactive, ref } from "vue";
import * as d3 from "d3";

const DATA_PATH = "http://vis.lab.djosix.com:2020/data/spotify_tracks.csv";
const NUMERIC_FEATURES = [
  "popularity",
  "duration_ms",
  // "explicit",
  "danceability",
  "energy",
  "key",
  "loudness",
  "mode",
  "speechiness",
  "acousticness",
  "instrumentalness",
  "liveness",
  "valence",
  "tempo",
  "time_signature",
  // "track_genre",
];

export function useSpotify() {
  const isLoading = ref(true);
  const data = ref(null);
  const error = ref(null);
  const genres = ref([]);
  const stats = reactive({
    numTracks: 0,
    numArtists: 0,
    numGenres: 0,
    numAlbums: 0,
  });

  onMounted(() => {
    d3.csv(DATA_PATH)
      .then((raw) => {
        data.value = raw.map((d) => {
          NUMERIC_FEATURES.forEach((f) => (d[f] = Number(d[f])));
          return d;
        });
        genres.value = [...new Set(data.value.map((d) => d.track_genre))].sort();
        stats.numTracks = d3.count(data.value, (d) => d[""]);
        stats.numArtists = d3.count(data.value, (d) => d.artists);
        stats.numGenres = genres.value.length;
        stats.numAlbums = d3.count(data.value, (d) => d.album_name);
      })
      .catch((err) => (error.value = err))
      .finally(() => (isLoading.value = false));
  });

  return {
    isLoading,
    data,
    error,
    genres,
    stats,
  };
}
