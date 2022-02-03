import type { DataTableRow } from "@/types";

export default function sortByField(
  items: DataTableRow[],
  field: keyof DataTableRow
) {
  return items.sort((a, b) => {
    if (a[field] < b[field]) {
      return -1;
    } else if (a[field] > b[field]) {
      return 1;
    } else {
      return 0;
    }
  });
}
