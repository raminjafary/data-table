<script setup lang="ts">
import { PropType, computed, ref, watch } from "vue";
import type { DataTableRow, PaginateOption } from "@/types";

const $props = defineProps({
  items: { type: Array as PropType<DataTableRow[]>, default: () => [] },
  headers: { type: Array as PropType<any[]>, default: () => [] },
  options: {
    type: Object as PropType<PaginateOption>,
    default: () => ({ page: 0, itemPerPage: 10 }),
  },
});

const emit = defineEmits(["paginate"]);

const options = ref($props.options);

const itemNames = computed(() => $props.headers.map((item) => item.key));

function paginate() {
  emit("paginate", options.value);
}

watch(
  () => $props.options,
  (options) => {
    options.value = options;
    paginate();
  }
);

function prev() {
  if (options.value.page <= 0) {
    return;
  }

  options.value.page -= 1;
  paginate();
}

function next() {
  if (!$props.items.length) {
    return;
  }

  options.value.page += 1;
  paginate();
}
</script>

<template>
  <div class="data-table">
    <table>
      <thead>
        <tr v-for="(header, index) in headers" :key="index">
          <th class="data-table__header">
            <slot :header="header" :name="'header.' + header.key">
              <span class="data-table__title">
                {{ header.name }}
              </span>
            </slot>
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-if="items.length">
          <tr v-for="(item, index) in items" :key="index">
            <td
              v-for="(name, index) in itemNames"
              :key="index"
              class="data-table__header"
            >
              <slot :item="item" :name="'item.' + name">
                <span class="data-table__content">
                  {{ item[name as keyof DataTableRow] }}
                </span>
              </slot>
            </td>
          </tr>
        </template>
        <template v-else>
          <slot name="no-result">
            <span class="data-table__no-result"> نتیجه‌ای یافت نشد! </span>
          </slot>
        </template>
      </tbody>
    </table>
    <div class="data-table__btns">
      <button @click="prev">&lsaquo;</button>
      <button @click="next">&rsaquo;</button>
    </div>
  </div>
</template>
<style scoped>
.data-table {
  padding: 30px 0;
  border-radius: 8px;
  border: 1px solid #b0b0b0;
  padding: 0;
  max-width: 100%;
  margin: auto 16px;
  overflow-x: auto;
}

table {
  padding: 30px 0;
  width: 100%;
  padding: 0;
  border-bottom: 1px solid rgb(128, 128, 128);
}

thead {
  border-bottom: 1px solid rgb(128, 128, 128);
  padding: 16px;
  display: flex;
  justify-content: space-between;
  position: sticky;
}

thead tr {
  display: flex;
  font-size: 1.6rem;
}

.data-table__header {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.data-table__title {
  font-size: 1.6rem;
}

.data-table__content {
  font-size: 1.2rem;
}

tbody {
  overflow-y: auto;
  height: 600px;
  display: block;
  width: 100%;
}

tbody tr {
  height: fit-content;
  display: flex;
  justify-content: space-between;
  min-height: 50px;
}

td {
  padding: 1.6rem;
}

tbody tr:nth-child(even) {
  background-color: rgba(0, 0, 0, 0.06) !important;
}

th,
td {
  width: 156px;
}

input {
  border-radius: 0.4rem;
  font-size: 1.6rem;
  flex: 1 1 auto;
  padding: 0.8rem;
  max-width: 100%;
  min-width: 0;
  box-shadow: none;
  margin-bottom: 0.8rem;
}

input:focus {
  outline-color: blue;
}

.data-table__btns {
  padding: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.data-table__btns button {
  all: unset;
  font-size: 3rem;
  width: 25px;
  height: 25px;
  margin: auto 1.6rem;
}

.data-table__no-result {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  font-size: 1.6rem;
}
</style>
