import type { SectionSignProps } from '../components/SectionSign/SectionSign'

/**
 * Rótulos de las secciones de la tienda.
 *
 * Una entrada por sección: añadir una es añadir aquí su título y su
 * ilustración, sin tocar ningún componente. Las secciones que todavía no
 * tienen arte propio omiten `illustration` y salen con el rótulo solo.
 */
export const SECTION_SIGNS = {
  accessories: {
    title: 'Accesorios',
    illustration: {
      src: '/assets/tokagotchis/trio/trio_tokagotchis_front.svg',
      width: '78%',
      maxWidth: 300,
      overlap: 25,
      plankSrc: '/assets/ui/tables/table_accessories.svg',
    },
  },

  eggs: {
    title: 'Huevos',
    illustration: {
      src: '/assets/ui/egg/egg_all_shop.svg',
      width: '40%',
      maxWidth: 300,
      overlap: 10,
      plankSrc: '/assets/ui/tables/table_egg.svg',
    },
  },

  specials: {
    title: 'Especiales'
  },


  potions: {
    title: 'Pociones',
    illustration: {
      src: '/assets/ui/potion/ai_potions.svg',
      width: '40%',
      maxWidth: 300,
      overlap: 30,
      plankSrc: '/assets/ui/tables/table_potions.svg',
    },
  },
} satisfies Record<string, SectionSignProps>
