declare module 'animejs' {
  export type AnimeParams = any
  const anime: (params: AnimeParams) => any
  export default anime
}

declare module 'animejs/lib/anime.es.js' {
  export type AnimeParams = any
  const anime: (params: AnimeParams) => any
  export default anime
}

