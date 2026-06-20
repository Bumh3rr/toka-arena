import type { CollectionResponseDTO, ColAbility } from '../types/collection.types'

export interface CollectionApi {
  getCollection(): Promise<CollectionResponseDTO>
  activate(tokaId: string): Promise<void>
  toggleFav(tokaId: string, fav: boolean): Promise<void>
}

// ── habilidades por especie ─────────────────────────────────────────────────────
// Tomadas del juego real (SPECIES_ABILITIES) y mapeadas a la forma de la colección.
const ABILITIES_TOFU: ColAbility[] = [
  { name: 'Mordida', nrg: 15, desc: 'Daño 1.0x Atk', signature: false },
  { name: 'Ladrido', nrg: 20, desc: '+15% Ataque por 2 turnos', signature: false },
  { name: 'Guardia', nrg: 25, desc: '-30% daño recibido el próximo turno', signature: false },
  { name: 'Lealtad', nrg: 45, desc: 'Daño 1.4x Atk. Si HP < 30%, cura 20% del daño causado', signature: true },
]
const ABILITIES_MOCHI: ColAbility[] = [
  { name: 'Zarpazo', nrg: 15, desc: 'Daño 0.9x Atk. 20% prob. de ignorar defensa', signature: false },
  { name: 'Agilidad', nrg: 25, desc: '25% prob. de esquivar el siguiente ataque', signature: false },
  { name: 'Bufido', nrg: 20, desc: 'Reduce Defensa del rival un 20%', signature: false },
  { name: 'Frenesí', nrg: 45, desc: '2 golpes de 0.7x Atk. En Legendario, 30% prob. de crítico (x1.5)', signature: true },
]
const ABILITIES_HANA: ColAbility[] = [
  { name: 'Florazo', nrg: 15, desc: 'Daño 1.0x Atk', signature: false },
  { name: 'Fotosíntesis', nrg: 20, desc: 'Recupera vitalidad y gana ritmo', signature: false },
  { name: 'Espinas', nrg: 25, desc: 'Aumenta defensa por 2 turnos', signature: false },
  { name: 'Tormenta de Pétalos', nrg: 45, desc: 'Daño 1.35x Atk', signature: true },
]

// ── roster mock ─────────────────────────────────────────────────────────────────
// 3 especies reales (TOFU/MOCHI/HANA), mismo `nick` por especie para que "Agrupar"
// apile duplicados. El activo (tofu1) lleva Corona + Super Capa para lucir el preview.
const MOCK_ROSTER: CollectionResponseDTO['roster'] = [
  { id: 'tofu1', nick: 'Tofu', species: 'TOFU', rarity: 'EPIC',   fav: true,  origin: 'Génesis',
    cp: 195, stats: { hp: 140, atk: 18, def: 38, nrg: 110 }, equippedHead: 'acc_crown', equippedBody: 'acc_cape', abilities: ABILITIES_TOFU },
  { id: 'tofu2', nick: 'Tofu', species: 'TOFU', rarity: 'RARE',   fav: false, origin: 'Comprado',
    cp: 80,  stats: { hp: 75,  atk: 10, def: 22, nrg: 70  }, equippedHead: 'acc_helmet', equippedBody: null, abilities: ABILITIES_TOFU },
  { id: 'tofu3', nick: 'Tofu', species: 'TOFU', rarity: 'COMMON', fav: false, origin: 'Génesis',
    cp: 30,  stats: { hp: 60,  atk: 7,  def: 18, nrg: 60  }, equippedHead: null, equippedBody: null, abilities: ABILITIES_TOFU },

  { id: 'mochi1', nick: 'Mochi', species: 'MOCHI', rarity: 'LEGENDARY', fav: true,  origin: 'Ganado en apuesta',
    cp: 480, stats: { hp: 150, atk: 12, def: 52, nrg: 105 }, equippedHead: 'acc_helmet', equippedBody: null, abilities: ABILITIES_MOCHI },
  { id: 'mochi2', nick: 'Mochi', species: 'MOCHI', rarity: 'EPIC',      fav: false, origin: 'Comprado',
    cp: 180, stats: { hp: 115, atk: 10, def: 40, nrg: 92  }, equippedHead: null, equippedBody: null, abilities: ABILITIES_MOCHI },
  { id: 'mochi3', nick: 'Mochi', species: 'MOCHI', rarity: 'COMMON',    fav: false, origin: 'Génesis',
    cp: 25,  stats: { hp: 55,  atk: 6,  def: 15, nrg: 55  }, equippedHead: null, equippedBody: null, abilities: ABILITIES_MOCHI },

  { id: 'hana1', nick: 'Hana', species: 'HANA', rarity: 'RARE',   fav: false, origin: 'Génesis',
    cp: 88,  stats: { hp: 90,  atk: 8,  def: 32, nrg: 80  }, equippedHead: 'acc_hat', equippedBody: null, abilities: ABILITIES_HANA },
  { id: 'hana2', nick: 'Hana', species: 'HANA', rarity: 'COMMON', fav: false, origin: 'Comprado',
    cp: 18,  stats: { hp: 52,  atk: 5,  def: 14, nrg: 50  }, equippedHead: null, equippedBody: null, abilities: ABILITIES_HANA },
  { id: 'hana3', nick: 'Hana', species: 'HANA', rarity: 'EPIC',   fav: true,  origin: 'Ganado en apuesta',
    cp: 200, stats: { hp: 108, atk: 15, def: 32, nrg: 93  }, equippedHead: null, equippedBody: null, abilities: ABILITIES_HANA },
]

// ── catálogo de accesorios ──────────────────────────────────────────────────────
// Los 4 reales (con code de render + PNG) y 2 entradas bloqueadas (teasers ???).
const MOCK_ACCESSORIES: CollectionResponseDTO['accessories'] = [
  { id: 'acc_helmet', name: 'Casco',      slot: 'cabeza', owned: 2, equipped: ['tofu2', 'mochi1'], locked: false, code: 'HELMET',     image: '/assets/accesorios/casco.png' },
  { id: 'acc_crown',  name: 'Corona',     slot: 'cabeza', owned: 1, equipped: ['tofu1'],           locked: false, code: 'CROWN',      image: '/assets/accesorios/corona.png' },
  { id: 'acc_hat',    name: 'Sombrero',   slot: 'cabeza', owned: 1, equipped: ['hana1'],           locked: false, code: 'HAT',        image: '/assets/accesorios/sombrero.png' },
  { id: 'acc_cape',   name: 'Super Capa', slot: 'cuerpo', owned: 1, equipped: ['tofu1'],           locked: false, code: 'SUPER_CAPE', image: '/assets/accesorios/capa.png' },
  { id: 'acc_locked1', name: '???', slot: 'cara',    owned: 0, equipped: [], locked: true, code: null, image: null },
  { id: 'acc_locked2', name: '???', slot: 'espalda', owned: 0, equipped: [], locked: true, code: null, image: null },
]

// Estado mutable en memoria para simular activate/fav entre llamadas.
const _db = {
  activeTokaId: 'tofu1',
  roster: structuredClone(MOCK_ROSTER) as CollectionResponseDTO['roster'],
}

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

export const mockCollectionApi: CollectionApi = {
  async getCollection() {
    await delay(800)
    return {
      serverTime: new Date().toISOString(),
      activeTokaId: _db.activeTokaId,
      roster: structuredClone(_db.roster),
      accessories: structuredClone(MOCK_ACCESSORIES),
      lockedSpecies: [{ key: 'mystery' }],
      speciesTotal: 4,
    }
  },
  async activate(tokaId) {
    await delay(200)
    _db.activeTokaId = tokaId
  },
  async toggleFav(tokaId, fav) {
    await delay(100)
    const t = _db.roster.find((r) => r.id === tokaId)
    if (t) t.fav = fav
  },
}

// ── SWAP POINT ─────────────────────────────────────────────────────────────────
export const collectionApi: CollectionApi = mockCollectionApi
