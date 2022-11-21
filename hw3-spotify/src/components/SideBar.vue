<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps(["genres", "modelValue"]);
const emit = defineEmits(["update:modelValue"]);

const handleClick = (genre) => {
  const idx = props.modelValue.indexOf(genre);
  if ((idx === -1 && props.modelValue.length >= 10) || (idx !== -1 && props.modelValue.length <= 2))
    return;
  emit(
    "update:modelValue",
    idx === -1 ? [...props.modelValue, genre] : props.modelValue.filter((_, i) => i !== idx)
  );
};
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="text-2xl font-semibold text-accent uppercase italic">
      Genre
      <span :class="['text-xs', props.modelValue.length < 10 ? 'text-warning' : 'text-error']"
        >{{ props.modelValue.length }}/10</span
      >
    </div>
    <div class="flex-1 basis-0 overflow-y-scroll scrollbar-thumb-accent scrollbar-thin">
      <div
        v-for="genre in props.genres"
        :key="genre"
        :class="[
          'pl-2 py-1 border-l-4 hover:border-secondary my-2 cursor-pointer',
          props.modelValue.includes(genre) ? 'border-secondary' : 'border-teal-50',
        ]"
        @click="handleClick(genre)"
      >
        <span>{{ genre }}</span>
      </div>
    </div>
  </div>
</template>
