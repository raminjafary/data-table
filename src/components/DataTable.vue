<script setup lang="ts">
import { PropType, computed, ref } from "vue";
import type { DataTableRow, DataTableOption, DataTableHeaders } from "@/types";

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
  options.value.sortBy = key;
  onChange();
}

function prev() {
  if (options.value.page <= 0) {
    return;
  }

  options.value.page -= 1;
  onChange();
}

function next() {
  if (!$props.items.length) {
    return;
  }

  options.value.page += 1;
  onChange();
}

function click(data: DataTableRow) {
  $emit("click", data);
}

function shouldMarkRowById(id: number) {
  return $props.markRows?.includes(id);
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
            <span v-if="header.sortable" @click="sortBy(header.key)"
              >مرتب‌سازی</span
            >
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-if="items.length">
          <tr
            v-for="(item, index) in items"
            :key="index"
            :class="{ 'data-table__row---marked': shouldMarkRowById(item.id) }"
            @click="click(item)"
          >
            <td
              v-for="(name, index) in itemNames"
              :key="index"
              class="data-table__header"
            >
              <slot :item="item" :name="'item.' + name" :on="{ click }">
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
      <slot name="pagination" :on="{ prev, next }">
        <button @click="prev">&lsaquo;</button>
        <button @click="next">&rsaquo;</button>
      </slot>
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
  cursor: pointer;
}

td {
  padding: 1.6rem;
}

tbody tr:nth-child(even) {
  background-color: rgba(0, 0, 0, 0.06);
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

.data-table__row---marked {
  background-color: #00bcd4 !important;
  color: white;
  border-bottom: 1px solid white;
  font-weight: 800;
}
</style>
