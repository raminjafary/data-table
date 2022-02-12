<script setup lang="ts">
//? vue
import { computed, ref } from "vue";
//? components
import Pagination from "@/components/Pagination.vue";
//? types
import type { DataTableRow, DataTableOption, DataTableHeaders } from "@/types";
import type { PropType } from "vue";

const $props = defineProps({
  items: { type: Array as PropType<DataTableRow[]>, default: () => [] },
  headers: { type: Array as PropType<DataTableHeaders[]>, default: () => [] },
  markRows: { ype: Array as PropType<number[]>, default: () => [] },
  modelValue: {
    type: Object as PropType<DataTableOption>,
    default: () => ({ page: 0, itemPerPage: 10, sortBy: "name" }),
  },
});

const $emit = defineEmits(["update:modelValue", "click"]);

const options = ref($props.modelValue);

const itemNames = computed(() => $props.headers.map((item) => item.key));

function onChange() {
  $emit("update:modelValue", options.value);
}

function sortBy(key: DataTableOption["sortBy"]) {
  options.value.sortBy = options.value.sortBy === key ? "" : key;
  onChange();
}

function click(data: DataTableRow) {
  $emit("click", data);
}

function shouldMarkRowById(id: number) {
  return ($props.markRows as number[])?.includes(id);
}
</script>

<template>
  <div class="data-table">
    <table>
      <thead>
        <tr v-for="(header, index) in headers" :key="index">
          <th class="data-table__header">
            <slot :header="header" :name="'header.' + header.key">
              <span class="data-table__header-title">
                {{ header.name }}
              </span>
            </slot>
            <span
              class="data-table__header-sort"
              v-if="header.sortable"
              @click="sortBy(header.key)"
              :class="{
                'data-table__header-sort--active':
                  options.sortBy === header.key,
              }"
            >
              {{ options.sortBy === header.key ? "&darr;" : "&uarr;" }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-if="items.length">
          <tr
            v-for="(item, index) in items"
            :key="index"
            :class="{ 'data-table__row--marked': shouldMarkRowById(item.id) }"
            @click="click(item)"
          >
            <td v-for="(name, index) in itemNames" :key="index">
              <slot :item="item" :name="'item.' + name" :on="{ click }">
                <span class="data-table__row-ontent">
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
    <Pagination v-model="options.page" />
  </div>
</template>
<style scoped>
.data-table {
  padding: 3rem 0;
  border-radius: 0.8rem;
  border: 0.1rem solid var(--color-mild-gray);
  padding: 0;
  max-width: 100%;
  margin: auto 16px;
  overflow-x: auto;
}

table {
  padding: 3rem 0;
  width: 100%;
  padding: 0;
  border-bottom: 0.1rem solid var(--color-solid-gray);
}

thead {
  border-bottom: 0.1rem solid var(--color-solid-gray);
  padding: 1.6rem;
  display: flex;
  position: sticky;
  justify-content: space-between;
}

thead tr {
  display: flex;
  font-size: var(--text-16);
}

.data-table__header {
  color: var(--color-solid-black);
}

.data-table__header-title {
  font-size: var(--text-16);
  font-weight: 700;
}

.data-table__row-ontent {
  font-size: var(--text-12);
}

tbody {
  overflow-y: auto;
  height: 60rem;
  display: block;
  width: 100%;
}

tbody tr {
  height: fit-content;
  display: flex;
  justify-content: space-between;
  min-height: 5rem;
  cursor: pointer;
}

td {
  padding: 1.6rem;
}

tbody tr:nth-child(even) {
  background-color: var(--color-striped-row);
}

th,
td {
  width: 20rem;
  margin: auto;
}

.data-table__no-result {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: var(--text-16);
}

.data-table__row--marked {
  font-weight: 700;
  background-color: var(--color-blue) !important;
  color: var(--color-white);
  border-bottom: 0.1rem solid var(--color-white);
}
.data-table__header-sort {
  font-size: 1.5rem;
  opacity: 0.4;
  cursor: pointer;
  padding: 0.4rem;
}

.data-table__header-sort--active {
  opacity: 1;
  font-weight: bold;
}
</style>
