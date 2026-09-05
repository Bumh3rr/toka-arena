import type {  Species } from "../domain/tokagotchi"

export const SPECIES_LABEL: Record<Species, string> = {
  TOFU: 'Tofu',
  MOCHI: 'Mochi',
  HANA: 'Hana',
}

// Frase de personalidad por especie — le da alma al momento.
export const FLAVOR: Record<Species, string> = {
  TOFU: 'Equilibrado y resistente. Un compañero leal que nunca te abandonará.',
  MOCHI: 'Veloz y certero. Un atacante nato que no conoce la piedad.',
  HANA: 'Fuerte como un roble. Un tanque que protege a los suyos.',
}
