export default function cleanEmptyProps(
  obj: Record<string, string | number>
): Record<string, string | number> {
  for (const prop in obj) {
    if (obj[prop] === "" || obj[prop] == null) {
      delete obj[prop];
    }
  }
  return obj;
}
