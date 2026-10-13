import type { IconType } from 'react-icons'
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import type { IconName } from '../types/profile'

export const icons: Record<IconName, IconType> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  envelope: FaEnvelope,
}
