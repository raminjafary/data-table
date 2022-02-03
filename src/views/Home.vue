<script setup lang="ts">
//? vue
import { ref, reactive, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
//? components
import DataTable from "@/components/DataTable.vue";
import InputText from "@/components/InputText.vue";
//? utils
import { useDebounceRef } from "@/composable/useDebounceRef";
import cleanEmptyProps from "@/utils/cleanEmptyProps";
import sortByField from "@/utils/sortByField";
import BST from "@/utils/BST";
import JSONData from "@/data.json";
//? types
import type { DataTableOption, DataTableRow } from "@/types";

const $router = useRouter();
const $route = useRoute();

const bst = new BST(JSONData as DataTableRow[]);

const options = ref({
  itemPerPage: 20,
  page: Number($route.query?.page) || 0,
  sortBy: "name",
} as DataTableOption);

const name = ref($route.query?.name?.toString() ?? "");
const debouncedName = useDebounceRef(name);

const field = ref($route.query?.field?.toString() ?? "");
const debouncedField = useDebounceRef(field);

const title = ref($route.query?.title?.toString() ?? "");
const debouncedTitle = useDebounceRef(title);

const date = ref($route.query?.date?.toString() ?? "");
const debouncedDate = useDebounceRef(date);

const headers = reactive([
  {
    name: "نام تغییر دهنده",
    key: "name",
    sortable: true,
  },
  {
    name: "تاریخ",
    key: "date",
    sortable: true,
  },
  {
    name: "فیلد",
    key: "field",
    sortable: true,
  },
  {
    name: "عنوان آگهی",
    key: "title",
    sortable: true,
  },
  {
    name: "مقدار قدیمی",
    key: "old_value",
    sortable: true,
  },
  {
    name: "مقدار جدید",
    key: "new_value",
    sortable: true,
  },
]);

watch(
  [
    debouncedTitle,
    debouncedName,
    debouncedField,
    debouncedDate,
    () => options.value.page,
  ],
  ([debouncedTitle, debouncedName, debouncedField, debouncedDate, page]) => {
    $router.replace({
      path: $route.fullPath,
      query: cleanEmptyProps({
        title: debouncedTitle,
        name: debouncedName,
        field: debouncedField,
        date: debouncedDate,
        page,
      }),
    });
  }
);

const filteredData = computed(() => {
  return dateFiltered.value.filter(
    (ad) =>
      ad.name.toLowerCase().includes(debouncedName.value) &&
      ad.field.toLowerCase().includes(debouncedField.value) &&
      ad.title.toLowerCase().includes(debouncedTitle.value)
  );
});

const dateFiltered = computed(() => {
  return debouncedDate.value
    ? bst.find(bst.root, debouncedDate.value)
    : JSONData;
});

const paginatedData = computed(() => {
  return sortedData.value.slice(
    options.value.page * options.value.itemPerPage,
    (options.value.page + 1) * options.value.itemPerPage
  );
});

const sortedData = computed(() => {
  return sortByField(filteredData.value, options.value.sortBy);
});
</script>

<template>
  <DataTable
    v-model="options"
    :items="paginatedData as DataTableRow[]"
    :headers="headers"
  >
    <template v-slot:[`header.name`]="{ header }">
      <InputText v-model="name" />
      <span>
        {{ header.name }}
      </span>
    </template>

    <template v-slot:[`header.field`]="{ header }">
      <InputText v-model="field" />
      <span>
        {{ header.name }}
      </span>
    </template>

    <template v-slot:[`header.title`]="{ header }">
      <InputText v-model="title" />
      <span>
        {{ header.name }}
      </span>
    </template>
    <template v-slot:[`header.date`]="{ header }">
      <InputText type="date" v-model="date" />
      <span>
        {{ header.name }}
      </span>
    </template>
  </DataTable>
</template>
