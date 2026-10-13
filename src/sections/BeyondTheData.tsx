import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import Section from '../components/Section'
import {
  HeritageTile,
  LanguagesTile,
  MusicTile,
  MoviesTile,
  FitnessTile,
  GamesTile,
  SportsTile,
  FoodTile,
  ClubsTile,
} from '../components/beyond/tiles'
import '../components/beyond/beyond.css'
import { beyond } from '../data/beyond'

const grid = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } }

function BeyondTheData() {
  const ref = useRef<HTMLDivElement>(null)
  const active = useInView(ref, { margin: '200px' })

  return (
    <Section id="beyond" index="06" title="Beyond the Data" wide>
      <p className="-mt-6 mb-10 max-w-2xl text-muted">{beyond.intro}</p>

      <motion.div
        ref={ref}
        data-active={active}
        variants={grid}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="bt-root grid grid-cols-1 auto-rows-[minmax(230px,auto)] gap-4 [perspective:1400px] sm:grid-cols-2 lg:grid-cols-4"
      >
        <HeritageTile />
        <LanguagesTile active={active} />
        <MusicTile />
        <MoviesTile />
        <FitnessTile />
        <GamesTile />
        <SportsTile />
        <FoodTile />
        <ClubsTile />
      </motion.div>
    </Section>
  )
}

export default BeyondTheData
