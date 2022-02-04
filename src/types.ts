export type DataTableRow = {
  id: number;
  name: string;
  date: string;
  title: string;
  field: string;
  old_value: string;
  new_value: string;
};

export type DataTableOption = {
  page: number;
  itemPerPage: number;
  sortBy: keyof DataTableRow | "";
};

export type DataTableHeaders = {
  name: string;
  key: keyof DataTableRow;
  sortable: boolean;
};
