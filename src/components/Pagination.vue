<script setup lang="ts">
//? vue
import { ref } from "vue";
//? types
import type { PropType } from "vue";

const $props = defineProps({
  modelValue: {
    type: Number as PropType<number>,
    default: 0,
  },
});

const $emit = defineEmits(["update:modelValue", "click"]);

const page = ref($props.modelValue);

function onChange() {
  $emit("update:modelValue", page.value);
}

function prev() {
  if (page.value <= 0) {
    return;
  }

  page.value -= 1;
  onChange();
}

function next() {
  page.value += 1;
  onChange();
}
</script>

<template>
  <div class="pagination">
    <slot name="activator" :prev="prev" :next="next" :page="page">
      <button @click="prev">&lsaquo;</button>
      <button @click="next">&rsaquo;</button>
    </slot>
  </div>
</template>
<style scoped>
.pagination {
  padding: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.pagination button {
  all: unset;
  font-size: 3rem;
  width: 2.5rem;
  height: 2.5rem;
  margin: auto 1.6rem;
}
</style>
