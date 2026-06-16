function isDev() {
  return import.meta.env.VITE_IS_DEV_MODE === "true";
}

export const IS_DEV_MODE = isDev();
