// src/components/CourseGraph.tsx
// Interactive 3D course graph (React Three Fiber + drei).
// Loaded lazily from the Coursework section, so three.js only downloads when it's needed.
import { useEffect, useMemo, useRef, type RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Line, OrbitControls, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { clusters, courses } from '../data/courses'
import { buildEdges, buildNeighbors } from '../lib/courseGraph'
import type { ClusterId } from '../types/course'

interface CourseGraphProps {
  focusCode: string | null          // course currently highlighted (hovered or selected)
  selectedCode: string | null
  onHover: (code: string | null) => void
  onSelect: (code: string) => void
  active: boolean                   // false when scrolled out of view → stop rendering
  reducedMotion: boolean
  touch: boolean                    // touch devices: no drag-to-rotate, so the page scrolls normally
}

type NodeState = 'focus' | 'neighbor' | 'dim' | 'idle'
type LabelRefs = RefObject<Map<string, HTMLSpanElement>>

// ---------- Layout: each cluster gets a center, its courses spread around it ----------
const CLUSTER_CENTERS: Record<ClusterId, THREE.Vector3> = {
  'ml-ai': new THREE.Vector3(0, 0.55, -2.1),
  'data-stats': new THREE.Vector3(-1.9, -0.35, 1.1),
  software: new THREE.Vector3(1.9, -0.15, 1.1),
}

const POSITIONS: Map<string, THREE.Vector3> = (() => {
  const positions = new Map<string, THREE.Vector3>()
  for (const cluster of clusters) {
    const members = courses.filter((c) => c.cluster === cluster.id)
    members.forEach((course, i) => {
      // Points on a small sphere around the cluster center (golden-angle spiral)
      const t = (i + 0.5) / members.length
      const phi = Math.acos(1 - 2 * t)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const r = 0.7 + members.length * 0.11 // bigger clusters get more room
      positions.set(
        course.code,
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta),
        ).add(CLUSTER_CENTERS[cluster.id]),
      )
    })
  }
  return positions
})()

const EDGES = buildEdges(courses)
const NEIGHBORS = buildNeighbors(EDGES)
const colorOf = (id: ClusterId) => clusters.find((c) => c.id === id)!.color

function stateFor(code: string, focusCode: string | null): NodeState {
  if (!focusCode) return 'idle'
  if (code === focusCode) return 'focus'
  if (NEIGHBORS.get(focusCode)?.has(code)) return 'neighbor'
  return 'dim'
}

// ---------- A single course node ----------
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
  const ringMat = useRef<THREE.MeshBasicMaterial>(null)

  const targetScale = state === 'focus' || selected ? 1.6 : state === 'neighbor' ? 1.2 : 1
  const targetOpacity = state === 'dim' ? 0.2 : 1
  const targetGlow = state === 'dim' ? 0.02 : state === 'focus' || selected ? 0.22 : 0.06

  // Smoothly animate scale, opacity and glow toward their targets every frame
  useFrame(({ clock, camera }, delta) => {
    const k = 1 - Math.exp(-delta * 10)
    if (group.current) group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, targetScale, k))
    if (core.current) core.current.opacity = THREE.MathUtils.lerp(core.current.opacity, targetOpacity, k)
    if (glow.current) glow.current.opacity = THREE.MathUtils.lerp(glow.current.opacity, targetGlow, k)

    // In-progress courses: a ring that keeps expanding and fading out, like a live signal
    if (ring.current && ringMat.current) {
      const t = reducedMotion ? 0.35 : (clock.elapsedTime * 0.6) % 1
      ring.current.scale.setScalar(1 + t * 1.4)
      ringMat.current.opacity = (state === 'dim' ? 0.15 : 0.7) * (1 - t)
      ring.current.lookAt(camera.position) // always face the camera
    }
  })

  return (
    <group ref={group} position={position}>
      {/* Core sphere (the only part that reacts to the pointer) */}
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
        <meshStandardMaterial
          ref={core}
          color={color}
          emissive={color}
          emissiveIntensity={0.55}
          roughness={0.35}
          transparent
        />
      </mesh>

      {/* Pulsing ring for courses in progress */}
      {inProgress && (
        <mesh ref={ring} raycast={() => null}>
          <ringGeometry args={[0.16, 0.18, 48]} />
          <meshBasicMaterial ref={ringMat} color={color} transparent depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Soft glow halo */}
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

// ---------- Keeps the HTML labels glued to their nodes ----------
function LabelTracker({ labelRefs }: { labelRefs: LabelRefs }) {
  const v = useMemo(() => new THREE.Vector3(), [])
  useFrame(({ camera, size }) => {
    for (const [code, pos] of POSITIONS) {
      const el = labelRefs.current?.get(code)
      if (!el) continue
      v.copy(pos).project(camera)
      const x = (v.x * 0.5 + 0.5) * size.width
      const y = (-v.y * 0.5 + 0.5) * size.height
      el.style.transform = `translate3d(${x}px, ${y - 16}px, 0) translate(-50%, -100%)`
      el.style.visibility = v.z > 1 ? 'hidden' : 'visible'
    }
  })
  return null
}

// ---------- Pulls the camera back on narrow containers so the whole graph fits ----------
function ResponsiveCamera() {
  const { camera, size } = useThree()
  useEffect(() => {
    const aspect = size.width / size.height
    const distance = aspect < 0.85 ? 11 : aspect < 1.1 ? 9.6 : 9
    camera.position.setLength(distance)
    camera.updateProjectionMatrix()
  }, [camera, size.width, size.height])
  return null
}

// ---------- The whole scene ----------
interface SceneProps extends Omit<CourseGraphProps, 'active'> {
  labelRefs: LabelRefs
}

function Scene({ focusCode, selectedCode, onHover, onSelect, reducedMotion, touch, labelRefs }: SceneProps) {
  const focusColor = focusCode ? colorOf(courses.find((c) => c.code === focusCode)!.cluster) : '#94a3b8'

  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[4, 5, 6]} intensity={30} />
      <ResponsiveCamera />
      <LabelTracker labelRefs={labelRefs} />

      {/* Connections: solid = shared topic, dashed = prerequisite */}
      {EDGES.map((edge) => {
        const touchesFocus = focusCode !== null && (edge.a === focusCode || edge.b === focusCode)
        const opacity = !focusCode ? 0.22 : touchesFocus ? 0.9 : 0.05
        return (
          <Line
            key={`${edge.a}-${edge.b}`}
            points={[POSITIONS.get(edge.a)!, POSITIONS.get(edge.b)!]}
            color={touchesFocus ? focusColor : '#94a3b8'}
            lineWidth={touchesFocus ? 1.6 : 0.8}
            transparent
            opacity={opacity}
            dashed={edge.kind === 'prereq'}
            dashSize={0.1}
            gapSize={0.07}
          />
        )
      })}

      {/* Nodes */}
      {courses.map((course) => (
        <Node
          key={course.code}
          code={course.code}
          color={colorOf(course.cluster)}
          position={POSITIONS.get(course.code)!}
          state={stateFor(course.code, focusCode)}
          selected={course.code === selectedCode}
          inProgress={course.inProgress ?? false}
          reducedMotion={reducedMotion}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}

      {/* Ambient floating particles */}
      <Sparkles
        count={35}
        scale={[9, 5, 9]}
        size={1.1}
        speed={reducedMotion ? 0 : 0.25}
        opacity={0.35}
        color="#14b8a6"
      />

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

      {/* Course code labels (HTML, so they stay crisp and follow the site theme) */}
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
              className={`absolute top-0 left-0 whitespace-nowrap rounded-md px-1.5 py-0.5 font-mono text-[10px] transition-[opacity,background-color,color] duration-300 will-change-transform ${
                highlighted
                  ? 'z-10 bg-foreground text-background opacity-100'
                  : state === 'dim'
                    ? 'text-muted opacity-25'
                    : 'text-muted opacity-90'
              }`}
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
