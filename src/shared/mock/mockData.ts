import type { HomeResponseDTO } from "../api/dto/home.dto";
import type { PlayerProfileDto, PlayerTokagotchisPageDTO } from "../api/dto/player.dto";
import type { CareResponseDTO } from "../api/dto/tokagotchi-responses.dto";
import type { RarityDTO, SpeciesDTO, TokagotchiDTO } from "../api/dto/tokagotchi.dto";

const id_toka_activo = "mocked-id-1";
const toka_activo = TokagotchiDTOMock("mocked-main-toka", id_toka_activo, "EPIC", "HANA")

export function HomeResponseDTOMock() :HomeResponseDTO{
    return {
        missions: { claimable: 0 },
        player: {
            serverTime: new Date().toISOString(),
            id: "mocked-id",
            username: "mocked-username",
            avatarUrl: null,
            tokafeed: 20,
            genesisClaimed: false,
            mainTokagotchi: toka_activo
        }
    };
}

export function TokagotchiDTOMock(str = "mocked-name", id: string, rarity: RarityDTO = 'COMMON', species: SpeciesDTO = 'MOCHI'): TokagotchiDTO {
    return {
        id: id,
        name: str,
        species: species,
        rarity: rarity,
        cp: 200,
        hp: 100,
        atk: 10,
        def: 10,
        nextEvolution: {
            nextRarity: 'RARE',
            cpRequired: 200,
            tfRequired: 50,
            successChance: 0.8,
            failCooldownHours: 24,
            evolvedAvailableAt: null
        },
        equipped: null,
        careCooldown: {
            feedAvailableAt: null,
            playAvailableAt: null,
            batheAvailableAt: null
        }
    };
}
export function CareResponseDTOMock() :CareResponseDTO{
    return {
        serverTime: new Date().toISOString(),
        missions: { claimable: 0 },
        tokagotchi: toka_activo,
        caresAvailableAt: {
            feedAvailableAt: new Date(Date.now() + 1000 * 60 * 5).toISOString(), // 5 minutes from now
            playAvailableAt: null,
            batheAvailableAt: null
        }
    };
}

export function PlayerProfileDTOMock() :PlayerProfileDto{
    return {
        id: "mocked-id",
        username: "mocked-username",
        avatarUrl: null,
        tokafeed: 20,
        genesisClaimed: false,
        mainTokagotchi: toka_activo
    };
}

export function PlayerTokagotchisPageDTOMock() :PlayerTokagotchisPageDTO{
    const tokagotchis: TokagotchiDTO[] = [
        toka_activo,
        TokagotchiDTOMock("mocked-name-2", "mocked-id-2", "LEGENDARY", "TOFU"),
        TokagotchiDTOMock("mocked-name-3", "mocked-id-3", "RARE", "MOCHI"),
        TokagotchiDTOMock("mocked-name-3", "mocked-id-4", "COMMON", "MOCHI"),
    ];
    return {
        content: tokagotchis,
        totalElements: 3,
        totalPages: 1,
        page: 0,
        size: 10,
        hasNext: false,
        hasPrevious: false
    };
}