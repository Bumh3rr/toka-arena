interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_IS_DEV_MODE: string
  readonly VITE_ENABLE_VCONSOLE: string
  readonly VITE_DEV_AUTH_CODE: string
  readonly VITE_ENABLE_DEV_MOCKS: string
  readonly VITE_ENABLE_PANEL_DEV_TOOLS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}