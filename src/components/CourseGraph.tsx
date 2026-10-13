import { useEffect, useMemo, useRef, type RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Line, OrbitControls, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { clusters, courses } from '../data/courses'
import { buildEdges, buildNeighbors } from '../lib/courseGraph'
import type { ClusterId } from '../types/course'

interface CourseGraphProps {
  focusCode: string | null
  selectedCode: string | null
  onHover: (code: string | null) => void
  onSelect: (code: string) => void
  active: boolean
  reducedMotion: boolean
  touch: boolean
}

type NodeState = 'focus' | 'neighbor' | 'dim' | 'idle'
type LabelRefs = RefObject<Map<string, HTMLSpanElement>>

const IDLE_COLOR = '#94a3b8'

const CLUSTER_CENTERS: Record<ClusterId, THREE.Vector3> = {
  'ml-ai': new THREE.Vector3(0, 0.55, -2.1),
  'data-stats': new THREE.Vector3(-1.9, -0.35, 1.1),
  software: new THREE.Vector3(1.9, -0.15, 1.1),
}

// golden-angle spiral around each cluster's center
function layoutNodes() {
  const positions = new Map<string, THREE.Vector3>()

  for (const cluster of clusters) {
    const members = courses.filter((c) => c.cluster === cluster.id)
    const radius = 0.7 + members.length * 0.11

    members.forEach((course, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / members.length)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const point = new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta),
      )
      positions.set(course.code, point.add(CLUSTER_CENTERS[cluster.id]))
    })
  }

  return positions
}

const POSITIONS = layoutNodes()
const EDGES = buildEdges(courses)
const NEIGHBORS = buildNeighbors(EDGES)

function clusterColor(id: ClusterId) {
  return clusters.find((c) => c.id === id)!.color
}

function stateFor(code: string, focusCode: string | null): NodeState {
  if (!focusCode) return 'idle'
  if (code === focusCode) return 'focus'
  if (NEIGHBORS.get(focusCode)?.has(code)) return 'neighbor'
  return 'dim'
}

interface NodeProps {
  code: string
  color: string
  position: THREE.Vector3
  state: NodeState
  selected: boolean
  inProgress: boolean
  reducedMotion: boolean
  onHover: (code: string | null) => void
  onSelect: (code: string) => void
}

function Node({ code, color, position, state, selected, inProgress, reducedMotion, onHover, onSelect }: NodeProps) {
  const group = useRef<THREE.Group>(null)
  const core = useRef<THREE.MeshStandardMaterial>(null)
  const glow = useRef<THREE.MeshBasicMaterial>(null)
  const ring = useRef<THREE.Mesh>(null)
  const ringMaterial = useRef<THREE.MeshBasicMaterial>(null)

  const emphasized = state === 'focus' || selected
  const dimmed = state === 'dim'

  let targetScale = 1
  if (emphasized) targetScale = 1.6
  else if (state === 'neighbor') targetScale = 1.2

  let targetGlow = 0.06
  if (dimmed) targetGlow = 0.02
  else if (emphasized) targetGlow = 0.22

  const targetOpacity = dimmed ? 0.2 : 1

  useFrame(({ clock, camera }, delta) => {
    const k = 1 - Math.exp(-delta * 10)
    const lerp = THREE.MathUtils.lerp

    if (group.current) group.current.scale.setScalar(lerp(group.current.scale.x, targetScale, k))
    if (core.current) core.current.opacity = lerp(core.current.opacity, targetOpacity, k)
    if (glow.current) glow.current.opacity = lerp(glow.current.opacity, targetGlow, k)

    if (ring.current && ringMaterial.current) {
      const t = reducedMotion ? 0.35 : (clock.elapsedTime * 0.6) % 1
      ring.current.scale.setScalar(1 + t * 1.4)
      ringMaterial.current.opacity = (dimmed ? 0.15 : 0.7) * (1 - t)
      ring.current.lookAt(camera.position)
    }
  })

  return (
    <group ref={group} position={position}>
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation()
          onHover(code)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          onHover(null)
          document.body.style.cursor = ''
        }}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(code)
        }}
      >
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial ref={core} color={color} emissive={color} emissiveIntensity={0.55} roughness={0.35} transparent />
      </mesh>

      {inProgress && (
        <mesh ref={ring} raycast={() => null}>
          <ringGeometry args={[0.16, 0.18, 48]} />
          <meshBasicMaterial ref={ringMaterial} color={color} transparent depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      )}

      <mesh raycast={() => null}>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshBasicMaterial
          ref={glow}
          color={color}
          transparent
          opacity={0.1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

function LabelTracker({ labelRefs }: { labelRefs: LabelRefs }) {
  const projected = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ camera, size }) => {
    for (const [code, position] of POSITIONS) {
      const el = labelRefs.current?.get(code)
      if (!el) continue
      projected.copy(position).project(camera)
      const x = (projected.x * 0.5 + 0.5) * size.width
      const y = (-projected.y * 0.5 + 0.5) * size.height
      el.style.transform = `translate3d(${x}px, ${y - 16}px, 0) translate(-50%, -100%)`
      el.style.visibility = projected.z > 1 ? 'hidden' : 'visible'
    }
  })

  return null
}

function ResponsiveCamera() {
  const { camera, size } = useThree()

  useEffect(() => {
    const aspect = size.width / size.height
    let distance = 9
    if (aspect < 0.85) distance = 11
    else if (aspect < 1.1) distance = 9.6
    camera.position.setLength(distance)
    camera.updateProjectionMatrix()
  }, [camera, size.width, size.height])

  return null
}

interface SceneProps extends Omit<CourseGraphProps, 'active'> {
  labelRefs: LabelRefs
}

function Scene({ focusCode, selectedCode, onHover, onSelect, reducedMotion, touch, labelRefs }: SceneProps) {
  const focusCourse = courses.find((c) => c.code === focusCode)
  const focusColor = focusCourse ? clusterColor(focusCourse.cluster) : IDLE_COLOR

  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[4, 5, 6]} intensity={30} />
      <ResponsiveCamera />
      <LabelTracker labelRefs={labelRefs} />

      {EDGES.map((edge) => {
        const touchesFocus = focusCode !== null && (edge.a === focusCode || edge.b === focusCode)
        let opacity = 0.22
        if (focusCode) opacity = touchesFocus ? 0.9 : 0.05

        return (
          <Line
            key={`${edge.a}-${edge.b}`}
            points={[POSITIONS.get(edge.a)!, POSITIONS.get(edge.b)!]}
            color={touchesFocus ? focusColor : IDLE_COLOR}
            lineWidth={touchesFocus ? 1.6 : 0.8}
            transparent
            opacity={opacity}
            dashed={edge.kind === 'prereq'}
            dashSize={0.1}
            gapSize={0.07}
          />
        )
      })}

      {courses.map((course) => (
        <Node
          key={course.code}
          code={course.code}
          color={clusterColor(course.cluster)}
          position={POSITIONS.get(course.code)!}
          state={stateFor(course.code, focusCode)}
          selected={course.code === selectedCode}
          inProgress={course.inProgress ?? false}
          reducedMotion={reducedMotion}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}

      <Sparkles count={35} scale={[9, 5, 9]} size={1.1} speed={reducedMotion ? 0 : 0.25} opacity={0.35} color="#14b8a6" />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={!touch}
        autoRotate={!reducedMotion && !focusCode}
        autoRotateSpeed={0.6}
        enableDamping
        minPolarAngle={Math.PI * 0.3}
        maxPolarAngle={Math.PI * 0.62}
      />
    </>
  )
}

function labelClass(state: NodeState, highlighted: boolean) {
  if (highlighted) return 'z-10 bg-foreground text-background opacity-100'
  if (state === 'dim') return 'text-muted opacity-25'
  return 'text-muted opacity-90'
}

function CourseGraph({ active, ...props }: CourseGraphProps) {
  const labelRefs = useRef(new Map<string, HTMLSpanElement>())

  return (
    <div className="absolute inset-0">
      <Canvas
        frameloop={active ? 'always' : 'never'}
        dpr={[1, 2]}
        camera={{ position: [0, 1.6, 9], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        onPointerMissed={() => props.onHover(null)}
      >
        <Scene {...props} labelRefs={labelRefs} />
      </Canvas>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {courses.map((course) => {
          const state = stateFor(course.code, props.focusCode)
          const highlighted = state === 'focus' || course.code === props.selectedCode

          return (
            <span
              key={course.code}
              ref={(el) => {
                if (el) labelRefs.current.set(course.code, el)
                else labelRefs.current.delete(course.code)
              }}
              className={`absolute top-0 left-0 whitespace-nowrap rounded-md px-1.5 py-0.5 font-mono text-[10px] transition-[opacity,background-color,color] duration-300 will-change-transform ${labelClass(state, highlighted)}`}
            >
              {course.code}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export default CourseGraph
