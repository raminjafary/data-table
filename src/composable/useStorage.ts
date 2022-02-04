import { ref, Ref } from "vue";

export function createStorage(storage: Storage, key: string) {
  const item: Ref<any> = ref(null);

  const getItem = () => {
    try {
      const itemVal = JSON.parse(storage.getItem(key) ?? "");
      if (itemVal != null) {
        item.value = itemVal;
      }
    } catch (error) {
      item.value = null;
    }
  };

  const setItem = (newVal: any) => {
    try {
      const newItem = JSON.stringify(newVal);
      storage.setItem(key, newItem);
      item.value = JSON.parse(newItem);
    } catch (error) {
      item.value = null;
    }
  };

  const removeItem = () => {
    try {
      storage.removeItem(key);
      item.value = null;
    } catch (error) {
      item.value = null;
    }
  };

  return {
    item,
    getItem,
    setItem,
    removeItem,
  };
}
