export interface Language {
  name: string
  greeting: string
  romanized?: string
  lang: string
  dir?: 'rtl' | 'ltr'
}

export interface Club {
  name: string
  url?: string
  flag?: string
}

export interface Photo {
  src: string
  thumb: string
  caption: string
  tag: 'Cooked' | 'Baked'
}

export interface Logo {
  src: string
  alt: string
}

export interface Beyond {
  intro: string
  heritage: { title: string; text: string }
  languages: Language[]
  clubs: Club[]
  music: { text: string; artists: string[]; url: string }
  movies: { text: string; url: string }
  fitness: { text: string; url: string }
  games: { text: string; titles: string[] }
  sports: { text: string; teams: string[]; logos: Logo[] }
  food: { text: string; photos: Photo[] }
}
