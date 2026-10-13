export interface Fact {
  label: string
  value: string
  logo?: string
  tall?: boolean
}

export interface StackGroup {
  category: string
  items: string[]
}

export interface BeltItem {
  name: string
  icon: string
  color: string
  matches?: string[]
}

export interface About {
  subheading: string
  bio: string[]
  photo: {
    src: string
    alt: string
    width: number
    height: number
  }
  facts: Fact[]
  stack: StackGroup[]
  belt: BeltItem[]
}
