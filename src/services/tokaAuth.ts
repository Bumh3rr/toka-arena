export function getAuthCodeFromURL(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('authCode');
}