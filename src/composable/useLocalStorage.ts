import { createStorage } from "./useStorage";
import { onMounted } from "vue";

export function useLocalStorage(key: string, runOnMount = true) {
  const { item, getItem, setItem, removeItem } = createStorage(
    localStorage,
    key
  );

  onMounted(() => runOnMount && getItem());

  return {
    item,
    getItem,
    setItem,
    removeItem,
  };
}
