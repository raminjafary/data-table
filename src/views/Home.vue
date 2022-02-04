<script setup lang="ts">
//? vue
import { ref, reactive, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
//? components
import DataTable from "@/components/DataTable.vue";
import InputText from "@/components/InputText.vue";
//? utils
import { useDebounceRef } from "@/composable/useDebounceRef";
import { useLocalStorage } from "@/composable/useLocalStorage";
import cleanEmptyProps from "@/utils/cleanEmptyProps";
import sortByField from "@/utils/sortByField";
import BST from "@/utils/bst";
import JSONData from "@/data.json";
//? types
import type { DataTableOption, DataTableRow, DataTableHeaders } from "@/types";

const $router = useRouter();
const $route = useRoute();

const bst = new BST(JSONData as DataTableRow[]);

const options = ref({
  itemPerPage: 20,
  page: Number($route.query?.page) || 0,
  sortBy: $route.query?.sortBy || "",
} as DataTableOption);

const name = ref(($route.query?.name as string) ?? "");
const debouncedName = useDebounceRef(name);

const field = ref(($route.query?.field as string) ?? "");
const debouncedField = useDebounceRef(field);

const title = ref(($route.query?.title as string) ?? "");
const debouncedTitle = useDebounceRef(title);

const date = ref(($route.query?.date as string) ?? "");
const debouncedDate = useDebounceRef(date);

const {
  item: staredRowIds,
  setItem: setStaredRowIds,
  getItem: getStaredRowIds,
} = useLocalStorage("staredRowIds");

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
] as DataTableHeaders[]);

watch(
  [
    debouncedTitle,
    debouncedName,
    debouncedField,
    debouncedDate,
    () => options.value.page,
    () => options.value.sortBy,
  ],
  ([
    debouncedTitle,
    debouncedName,
    debouncedField,
    debouncedDate,
    page,
    sortBy,
  ]) => {
    $router.replace({
      path: $route.fullPath,
      query: cleanEmptyProps({
        title: debouncedTitle,
        name: debouncedName,
        field: debouncedField,
        date: debouncedDate,
        sortBy,
        page,
      }),
    });
  }
);

const dateFiltered = computed(() => {
  return debouncedDate.value
    ? bst.find(bst.root, debouncedDate.value)
    : JSONData;
});

const filteredData = computed(() => {
  return dateFiltered.value.filter(
    (ad) =>
      ad.name.toLowerCase().includes(debouncedName.value) &&
      ad.field.toLowerCase().includes(debouncedField.value) &&
      ad.title.toLowerCase().includes(debouncedTitle.value)
  ) as DataTableRow[];
});

const sortedData = computed(() => {
  return options.value.sortBy
    ? sortByField(filteredData.value, options.value.sortBy)
    : filteredData.value;
});

const paginatedData = computed(() => {
  return sortedData.value.slice(
    options.value.page * options.value.itemPerPage,
    (options.value.page + 1) * options.value.itemPerPage
  );
});

function getRowData(data: DataTableRow) {
  getStaredRowIds();

  let staredIds: number[] = staredRowIds.value || [];

  if (staredIds.includes(data.id)) {
    staredIds = staredIds.filter((id) => id !== data.id);
  } else {
    staredIds.push(data.id);
  }

  staredRowIds.value = [...staredIds];

  setStaredRowIds(staredRowIds.value);
}
</script>

<template>
  <DataTable
    v-model="options"
    :items="paginatedData"
    :headers="headers"
    :markRows="staredRowIds"
    @click="getRowData"
  >
    <template v-slot:[`header.name`]="{ header }">
      <InputText v-model="name" />
      <span class="pt-8 inline-block">
        {{ header.name }}
      </span>
    </template>

    <template v-slot:[`header.field`]="{ header }">
      <InputText v-model="field" />
      <span class="pt-8 inline-block">
        {{ header.name }}
      </span>
    </template>

    <template v-slot:[`header.title`]="{ header }">
      <InputText v-model="title" />
      <span class="pt-8 inline-block">
        {{ header.name }}
      </span>
    </template>
    <template v-slot:[`header.date`]="{ header }">
      <InputText type="date" v-model="date" />
      <span class="pt-8 inline-block">
        {{ header.name }}
      </span>
    </template>
  </DataTable>
</template>
<style scoped>
.pt-8 {
  padding-top: 8px;
}

.inline-block {
  display: inline-block;
}
</style>
