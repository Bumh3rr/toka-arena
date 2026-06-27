import type { Ability, Species } from "../domain/tokagotchi"

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

const ABILITIES_TOFU: Ability[] = [
  { id: 1, name: 'Mordida', energyCost: 15, multiplier: 1.0, description: 'Daño 1.0x Atk', isSignature: false },
  { id: 2, name: 'Ladrido', energyCost: 20, multiplier: 1.15, description: '+15% Ataque por 2 turnos', isSignature: false },
  { id: 3, name: 'Guardia', energyCost: 25, multiplier: 0.7, description: '-30% daño recibido el próximo turno', isSignature: false },
  { id: 4, name: 'Lealtad', energyCost: 45, multiplier: 1.4, description: 'Daño 1.4x Atk. Si HP < 30%, cura 20% del daño causado', isSignature: true },
]
const ABILITIES_MOCHI: Ability[] = [
  { id: 1, name: 'Zarpazo', energyCost: 15, multiplier: 0.9, description: 'Daño 0.9x Atk. 20% prob. de ignorar defensa', isSignature: false },
  { id: 2, name: 'Agilidad', energyCost: 25, multiplier: 1.0, description: '25% prob. de esquivar el siguiente ataque', isSignature: false },
  { id: 3, name: 'Bufido', energyCost: 20, multiplier: 1.0, description: 'Reduce Defensa del rival un 20%', isSignature: false },
  { id: 4, name: 'Frenesí', energyCost: 45, multiplier: 0.7, description: '2 golpes de 0.7x Atk. En Legendario, 30% prob. de crítico (x1.5)', isSignature: true },
]
const ABILITIES_HANA: Ability[] = [
  { id: 1, name: 'Florazo', energyCost: 15, multiplier: 1.0, description: 'Daño 1.0x Atk', isSignature: false },
  { id: 2, name: 'Fotosíntesis', energyCost: 20, multiplier: 1.0, description: 'Recupera vitalidad y gana ritmo', isSignature: false },
  { id: 3, name: 'Espinas', energyCost: 25, multiplier: 1.0, description: 'Aumenta defensa por 2 turnos', isSignature: false },
  { id: 4, name: 'Tormenta de Pétalos', energyCost: 45, multiplier: 1.35, description: 'Daño 1.35x Atk', isSignature: true },
]
