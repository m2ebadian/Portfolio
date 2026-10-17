import type { Beyond } from '../types/beyond'

export const beyond: Beyond = {
  intro: "The side of me that doesn't show up in a repo: where I come from, what I'm into, and what I do off the keyboard.",

  heritage: {
    title: 'Persian roots',
    text: "I'm deeply connected to my Persian and Iranian heritage. The language, the culture, and the community are a big part of who I am.",
  },

  languages: [
    { name: 'Farsi / Persian', greeting: 'سلام', romanized: 'salām', lang: 'fa', dir: 'rtl' },
    { name: 'English', greeting: 'Hello', lang: 'en' },
    { name: 'Spanish', greeting: 'Hola', lang: 'es' },
  ],

  clubs: [
    { name: 'Iranian Student Association', flag: '/beyond/iran-flag.svg' },
    { name: 'MSU AI Club', url: 'https://www.msuaiclub.com/' },
    { name: 'Imagine Software at MSU' },
    { name: 'Ping Pong Club' },
  ],

  music: {
    text: 'Current favorites, in no particular order.',
    artists: ['The Strokes', 'Radiohead', 'Frank Ocean', 'Kendrick Lamar', 'Pink Floyd'],
    url: 'https://open.spotify.com/user/bagger%21',
  },

  movies: {
    text: 'I log pretty much every movie I watch on Letterboxd.',
    url: 'https://boxd.it/9cozv',
  },

  fitness: {
    text: "I'm in the gym regularly and track my lifts on Liftcard.",
    url: 'https://liftcard.app/b2gz',
  },

  games: {
    text: 'In rotation',
    titles: ['Apex Legends', 'Valorant'],
  },

  sports: {
    text: 'Always watching',
    teams: ['NBA', 'Detroit Lions', 'Liverpool FC'],
    logos: [
      { src: '/logos/detroit-lions.png', alt: 'Detroit Lions' },
      { src: '/logos/liverpool-fc.png', alt: 'Liverpool FC' },
    ],
  },

  food: {
    text: "When I'm not at a keyboard, I love to cook or bake something. Tap a photo to see it bigger.",
    photos: [
      { src: '/beyond/birria-tacos.webp', thumb: '/beyond/birria-tacos-thumb.webp', caption: 'Birria tacos with consommé', tag: 'Cooked' },
      { src: '/beyond/cinnamon-rolls.webp', thumb: '/beyond/cinnamon-rolls-thumb.webp', caption: 'Cinnamon rolls', tag: 'Baked' },
      { src: '/beyond/chicken-parmesan.webp', thumb: '/beyond/chicken-parmesan-thumb.webp', caption: 'Chicken parmesan with spaghetti and salad', tag: 'Cooked' },
      { src: '/beyond/chocolate-babka.webp', thumb: '/beyond/chocolate-babka-thumb.webp', caption: 'Chocolate babka', tag: 'Baked' },
      { src: '/beyond/salmon.webp', thumb: '/beyond/salmon-thumb.webp', caption: 'Seasoned salmon with rice and broccoli', tag: 'Cooked' },
      { src: '/beyond/chocolate-donuts.webp', thumb: '/beyond/chocolate-donuts-thumb.webp', caption: 'Chocolate-glazed filled donuts', tag: 'Baked' },
      { src: '/beyond/chicken-rice-bowl.webp', thumb: '/beyond/chicken-rice-bowl-thumb.webp', caption: 'Chicken with yellow rice, salad, and yogurt', tag: 'Cooked' },
      { src: '/beyond/oreo-brownies.webp', thumb: '/beyond/oreo-brownies-thumb.webp', caption: 'Oreo brownies', tag: 'Baked' },
      { src: '/beyond/herb-chicken-potatoes.webp', thumb: '/beyond/herb-chicken-potatoes-thumb.webp', caption: 'Herb chicken with roasted potatoes and salad', tag: 'Cooked' },
    ],
  },
}
