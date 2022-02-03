export default function cleanEmptyProps(obj: any): any {
  for (const prop in obj) {
    if (obj[prop] && typeof obj[prop] === "object") {
      cleanEmptyProps(obj[prop]);
    } else if (obj[prop] === "" || obj[prop] == null) {
      delete obj[prop];
    }
  }
  return obj;
}
