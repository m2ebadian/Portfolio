
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
  links: SocialLink[]
}