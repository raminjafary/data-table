<script setup lang="ts">
import { PropType } from "vue";

defineProps({
  modelValue: { type: String as PropType<string>, default: "" },
  label: { type: String as PropType<string>, default: undefined },
});

const $emit = defineEmits(["update:modelValue"]);

function onInputChange(e: Event) {
  $emit(
    "update:modelValue",
    (e as Event & { target: HTMLInputElement }).target.value
  );
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
  name: "InputText",
};
</script>

<template>
  <label v-if="label" :for="label">{{ label }}</label>
  <input
    :id="label"
    type="text"
    v-bind="$attrs"
    :value="modelValue"
    @input="onInputChange"
  />
</template>
<style scoped>
input {
  border-radius: 0.4rem;
  font-size: 1.6rem;
  flex: 1 1 auto;
  padding: 0.6rem;
  max-width: 100%;
  min-width: 0;
  box-shadow: none;
  margin-bottom: 0.8rem;
}

input:focus {
  outline-color: blue;
}
</style>
