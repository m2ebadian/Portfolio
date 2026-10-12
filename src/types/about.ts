// src/types/about.ts

// A single label/value row in the facts grid
export interface Fact {
  label: string
  value: string
  logo?: string 
}

// A group of related technologies
export interface StackGroup {
  category: string
  items: string[]
}

export interface About {
  subheading: string // short punchy line above the bio
  bio: string[]      // one string per paragraph
  photo: {
    src: string      // path inside public/
    alt: string      // describes the photo for screen readers
    width: number    // real pixel size, so the browser reserves space before it loads
    height: number
  }
  facts: Fact[]
  stack: StackGroup[]
}