import type { PlayerProfileHomeDTO } from "@/features/home/api/dto/home.dto";
import type { PlayerProfileHome } from "../home";
import { mapTokagotchiDTO } from "./tokagotchi.mapper";

/**
 * Mapea perfil del jugador desde DTO a domain type.
 * Transforma tokafeed → tf y mapea tokagotchi activo si existe.
 * @param dto - DTO del perfil home
 * @returns Domain PlayerProfileHome
 */
export function mapPlayerHomeDTO(dto: PlayerProfileHomeDTO): PlayerProfileHome {
  console.log("Mapeando PlayerProfileHomeDTO:", dto);
  return {
    id: dto.id,
    serverTime: new Date(dto.serverTime).getTime(),
    username: dto.username,
    avatarUrl: dto.avatarUrl,
    tf: dto.tokafeed,
    genesisClaimed: dto.genesisClaimed,
    mainTokagotchi: dto.mainTokagotchi ? mapTokagotchiDTO(dto.mainTokagotchi) : null,
  };
}
