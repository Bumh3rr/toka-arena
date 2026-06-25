import type { TokagotchiDTO } from '@/shared/api/dto/tokagotchi.dto'
import type { Tokagotchi } from '@/shared/domain/tokagotchi'
import type { ColAbility } from '../../types/collection.types'
import { mapTokagotchiDTO } from '@/shared/domain/mappers/tokagotchi.mapper'

const ABILITIES_TOFU: ColAbility[] = [
  { name: 'Mordida', nrg: 15, desc: 'Danio 1.0x Atk', signature: false },
  { name: 'Ladrido', nrg: 20, desc: '+15% Ataque por 2 turnos', signature: false },
  { name: 'Guardia', nrg: 25, desc: '-30% danio recibido el proximo turno', signature: false },
  { name: 'Lealtad', nrg: 45, desc: 'Danio 1.4x Atk. Si HP < 30%, cura 20% del danio causado', signature: true },
]

const ABILITIES_MOCHI: ColAbility[] = [
  { name: 'Zarpazo', nrg: 15, desc: 'Danio 0.9x Atk. 20% prob. de ignorar defensa', signature: false },
  { name: 'Agilidad', nrg: 25, desc: '25% prob. de esquivar el siguiente ataque', signature: false },
  { name: 'Bufido', nrg: 20, desc: 'Reduce Defensa del rival un 20%', signature: false },
  { name: 'Frenesi', nrg: 45, desc: '2 golpes de 0.7x Atk. En Legendario, 30% prob. de critico (x1.5)', signature: true },
]

const ABILITIES_HANA: ColAbility[] = [
  { name: 'Florazo', nrg: 15, desc: 'Danio 1.0x Atk', signature: false },
  { name: 'Fotosintesis', nrg: 20, desc: 'Recupera vitalidad y gana ritmo', signature: false },
  { name: 'Espinas', nrg: 25, desc: 'Aumenta defensa por 2 turnos', signature: false },
  { name: 'Tormenta de Petalos', nrg: 45, desc: 'Danio 1.35x Atk', signature: true },
]

const ABILITIES_BY_SPECIES: Record<string, ColAbility[]> = {
  TOFU: ABILITIES_TOFU,
  MOCHI: ABILITIES_MOCHI,
  HANA: ABILITIES_HANA,
}

const ACCESSORY_ID_BY_CODE: Record<string, string> = {
  HELMET: 'acc_helmet',
  CROWN: 'acc_crown',
  HAT: 'acc_hat',
  SUPER_CAPE: 'acc_cape',
}

export function mapTokaDtoListToColRoster(content: TokagotchiDTO[]): Tokagotchi[] {
  return content.map(mapTokagotchiDTO)
}
