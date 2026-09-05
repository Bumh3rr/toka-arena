import { tokenStore } from "./token.store";

export function logout() {
  tokenStore.clear();
  window.dispatchEvent(new CustomEvent("auth:expired"));
}