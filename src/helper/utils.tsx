import { storageKey } from "@/contants/DefaultValue";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setStorageData = (key: string, data: any): void => {
  localStorage.setItem(key, data);
};

export const getStorageData = (key: string) => {
  const data = localStorage.getItem(key);

  return data;
};

export const removeStorageData = (key: string): void => {
  localStorage.removeItem(key);
};

export const removeDefaultStorageData = (): void => {
  [
    storageKey.authToken,
    storageKey.authRefreshToken,
    storageKey.authInfo,
  ].forEach((x) => removeStorageData(x));
};
