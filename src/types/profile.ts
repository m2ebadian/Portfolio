export type IconName = 'github' | 'linkedin' | 'envelope'

export interface SocialLink {
  label: string
  url: string
  icon?: IconName
}

export interface Profile {
  name: string
  headline: string
  tagline: string
  contact: string
  resume: string
  location: string
  links: SocialLink[]
}
