<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useDebounceRef } from "@/composable/useDebounceRef";
import cleanEmptyProps from "@/utils/cleanEmptyProps";
import BST from "@/utils/BST";
import type { PaginateOption, DataTableRow } from "@/types";
import DataTable from "@/components/DataTable.vue";
import InputText from "@/components/InputText.vue";
import JSONData from "@/data.json";

const $router = useRouter();
const $route = useRoute();

const bst = new BST(JSONData);

const options = ref({
  itemPerPage: 20,
  page: Number($route.query?.page) || 0,
} as PaginateOption);

const name = ref($route.query?.name ?? "");
const debouncedName = useDebounceRef(name);

const field = ref($route.query?.field ?? "");
const debouncedField = useDebounceRef(field);

const title = ref($route.query?.title ?? "");
const debouncedTitle = useDebounceRef(title);

const date = ref($route.query?.date ?? "");
const debouncedDate = useDebounceRef(date);

const headers = reactive([
  {
    name: "نام تغییر دهنده",
    key: "name",
  },
  {
    name: "تاریخ",
    key: "date",
  },
  {
    name: "فیلد",
    key: "field",
  },
  {
    name: "عنوان آگهی",
    key: "title",
  },
  {
    name: "مقدار قدیمی",
    key: "old_value",
  },
  {
    name: "مقدار جدید",
    key: "new_value",
  },
]);

function paginate(options: PaginateOption) {
  options.value = options;
}

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

const paginatedData = computed(() => {
  return filteredData.value.slice(
    options.value.page * options.value.itemPerPage,
    (options.value.page + 1) * options.value.itemPerPage
  );
});

const dateFiltered = computed(() => {
  return debouncedDate.value
    ? bst.find(bst.root, debouncedDate.value)
    : JSONData;
});
</script>

<template>
  <DataTable
    :items="paginatedData as DataTableRow[]"
    :headers="headers"
    :options="options"
    @paginate="paginate"
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
