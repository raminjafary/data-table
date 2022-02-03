export type DataTableRow = {
  id: number;
  name: string;
  date: string;
  title: string;
  field: string;
  old_value: string;
  new_value: string;
};

export type PaginateOption = {
  page: number;
  itemPerPage: number;
};
