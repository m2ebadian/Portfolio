import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import * as THREE from 'three'
import type { MotionValue } from 'motion/react'

const COUNT = 14000

const palettes = {
  dark: { a: '#2dd4bf', b: '#8b5cf6', c: '#f59e0b', opacity: 0.85 },
  light: { a: '#0f766e', b: '#6d28d9', c: '#b45309', opacity: 0.8 },
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform int uFrom;
  uniform int uTo;
  uniform vec2 uPointer;
  uniform float uPointerStrength;
  uniform float uAspect;
  uniform float uSize;
  uniform vec3 uOffset;
  uniform float uScale;
  uniform float uScatter;

  attribute vec3 aNoise;
  attribute vec3 aWave;
  attribute vec3 aNet;
  // x: how far along the network (0 = input layer), y: 1 for a node, 0 for a connection
  attribute vec2 aPath;
  attribute float aSeed;

  varying float vTone;
  varying float vGlow;
  varying float vFade;
  varying float vEdge;

  mat2 rot(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
  }

  vec3 shape(int id) {
    if (id == 0) {
      vec3 p = aNoise;
      p += vec3(sin(uTime * 0.5 + aSeed * 20.0), cos(uTime * 0.4 + aSeed * 13.0), sin(uTime * 0.3 + aSeed * 7.0)) * 0.18;
      return p;
    }
    if (id == 1) {
      vec3 p = aWave;
      p.y += sin(p.x * 0.7 + uTime * 0.8) * 0.45 + cos(p.z * 1.1 + uTime * 0.6) * 0.25;
      p.yz *= rot(-0.35);
      return p;
    }
    vec3 p = aNet;
    p.y += sin(uTime * 1.2 + aSeed * 6.28) * 0.02;
    p.xz *= rot(sin(uTime * 0.25) * 0.35);
    p.yz *= rot(-0.12);
    return p;
  }

  void main() {
    float t = smoothstep(0.0, 1.0, clamp((uMorph - aSeed * 0.35) / 0.65, 0.0, 1.0));
    vec3 from = shape(uFrom);
    vec3 to = shape(uTo);
    // points arc outward a little while travelling between shapes
    vec3 p = mix(from, to, t) + normalize(aNoise + 0.001) * sin(t * 3.14159) * 0.6;
    // scrolling away blows the points apart
    p += normalize(aNoise + 0.001) * uScatter * uScatter * (3.0 + aSeed * 6.0);
    p.z += uScatter * aSeed * 4.0;
    p = p * uScale + uOffset;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // push points away from the cursor in screen space so it works for every shape
    vec2 ndc = gl_Position.xy / gl_Position.w;
    vec2 delta = (ndc - uPointer) * vec2(uAspect, 1.0);
    float falloff = exp(-dot(delta, delta) * 18.0) * uPointerStrength;
    gl_Position.xy += normalize(delta + 0.0001) * falloff * 0.12 * gl_Position.w;

    vTone = aSeed;
    vGlow = falloff;
    vFade = 1.0 - smoothstep(0.3, 1.0, uScatter);
    // soften the ends of the wave so it doesn't stop on a hard edge
    float waveWeight = (uFrom == 1 ? 1.0 - t : 0.0) + (uTo == 1 ? t : 0.0);
    float netWeight = (uFrom == 2 ? 1.0 - t : 0.0) + (uTo == 2 ? t : 0.0);
    vEdge = mix(1.0, 1.0 - smoothstep(0.55, 1.0, abs(aWave.x) / 4.25), waveWeight);

    // a pulse sweeps through the layers like a forward pass; connections stay faint until it reaches them
    float front = mod(uTime * 1.1, 6.0) - 0.8;
    float pulse = exp(-pow(aPath.x - front, 2.0) * 10.0);
    vEdge *= mix(1.0, mix(0.35 + pulse * 0.9, 1.0, aPath.y), netWeight);
    vGlow = max(vGlow, pulse * netWeight * (0.4 + aPath.y * 0.5));
    gl_PointSize = uSize * (1.0 + falloff * 2.0 + aPath.y * netWeight * 0.3) * (8.0 / -mv.z);
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uA;
  uniform vec3 uB;
  uniform vec3 uC;
  uniform float uOpacity;
  uniform float uDim;

  varying float vTone;
  varying float vGlow;
  varying float vFade;
  varying float vEdge;

  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float alpha = smoothstep(0.5, 0.1, r);
    vec3 color = vTone < 0.62 ? uA : (vTone < 0.92 ? uB : uC);
    color = mix(color, vec3(1.0), vGlow * 0.5);
    gl_FragColor = vec4(color, alpha * uOpacity * uDim * vFade * vEdge);
  }
`

const LAYERS = [4, 7, 7, 5, 2]

// a small fully connected network: dense clusters for nodes, thin lines of points for the weights
function buildNetwork(count: number) {
  const positions = new Float32Array(count * 3)
  const path = new Float32Array(count * 2)

  const nodes = LAYERS.map((size, layer) =>
    Array.from({ length: size }, (_, i) => ({
      x: (layer / (LAYERS.length - 1) - 0.5) * 5.2,
      y: (i - (size - 1) / 2) * 0.72,
      layer,
    })),
  )
  const edges = nodes.slice(1).flatMap((layer, l) => layer.flatMap((to) => nodes[l].map((from) => ({ from, to }))))
  const flatNodes = nodes.flat()
  const nodeCount = Math.floor(count * 0.22)

  for (let i = 0; i < count; i++) {
    if (i < nodeCount) {
      const node = flatNodes[i % flatNodes.length]
      const a = Math.random() * Math.PI * 2
      const r = 0.12 * Math.sqrt(Math.random())
      positions.set([node.x + Math.cos(a) * r, node.y + Math.sin(a) * r, (Math.random() - 0.5) * 0.15], i * 3)
      path.set([node.layer, 1], i * 2)
    } else {
      const { from, to } = edges[i % edges.length]
      const t = Math.random()
      const jitter = (Math.random() - 0.5) * 0.03
      positions.set([from.x + (to.x - from.x) * t, from.y + (to.y - from.y) * t + jitter, jitter], i * 3)
      path.set([from.layer + t, 0], i * 2)
    }
  }
  return { positions, path }
}

function buildGeometry() {
  const noise = new Float32Array(COUNT * 3)
  const wave = new Float32Array(COUNT * 3)
  const seeds = new Float32Array(COUNT)
  const columns = 160

  for (let i = 0; i < COUNT; i++) {
    const r = 3.2 * Math.cbrt(Math.random())
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    noise.set([r * Math.sin(phi) * Math.cos(theta) * 1.25, r * Math.cos(phi) * 0.85, r * Math.sin(phi) * Math.sin(theta)], i * 3)

    const col = i % columns
    const row = Math.floor(i / columns)
    const rows = Math.ceil(COUNT / columns)
    wave.set([(col / (columns - 1) - 0.5) * 8.5, 0, (row / (rows - 1) - 0.5) * 6], i * 3)

    seeds[i] = Math.random()
  }

  const network = buildNetwork(COUNT)

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3))
  geometry.setAttribute('aNoise', new THREE.BufferAttribute(noise, 3))
  geometry.setAttribute('aWave', new THREE.BufferAttribute(wave, 3))
  geometry.setAttribute('aNet', new THREE.BufferAttribute(network.positions, 3))
  geometry.setAttribute('aPath', new THREE.BufferAttribute(network.path, 2))
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20)
  return geometry
}

interface FieldProps {
  shape: number
  scatter: MotionValue<number>
  dark: boolean
  reducedMotion: boolean
}

function Field({ shape, scatter, dark, reducedMotion }: FieldProps) {
  const geometry = useMemo(buildGeometry, [])
  const { size } = useThree()
  const pointer = useRef(new THREE.Vector2(9, 9))
  const pointerActive = useRef(false)

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uMorph: { value: 1 },
          uFrom: { value: 0 },
          uTo: { value: 0 },
          uPointer: { value: new THREE.Vector2(9, 9) },
          uPointerStrength: { value: 0 },
          uAspect: { value: 1 },
          uSize: { value: 2.4 },
          uOffset: { value: new THREE.Vector3() },
          uScale: { value: 1 },
          uA: { value: new THREE.Color() },
          uB: { value: new THREE.Color() },
          uC: { value: new THREE.Color() },
          uOpacity: { value: 1 },
          uDim: { value: 1 },
          uScatter: { value: 0 },
        },
      }),
    [],
  )

  useEffect(() => {
    const palette = dark ? palettes.dark : palettes.light
    const { uniforms } = material
    uniforms.uA.value.set(palette.a)
    uniforms.uB.value.set(palette.b)
    uniforms.uC.value.set(palette.c)
    uniforms.uOpacity.value = palette.opacity
    uniforms.uSize.value = dark ? 2.4 : 3
    material.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending
    material.needsUpdate = true
  }, [dark, material])

  // start a new morph from whatever shape the points are heading to now
  useEffect(() => {
    const { uniforms } = material
    if (uniforms.uTo.value === shape) return
    uniforms.uFrom.value = uniforms.uTo.value
    uniforms.uTo.value = shape
    uniforms.uMorph.value = reducedMotion ? 1 : 0
  }, [shape, material, reducedMotion])

  // wide screens keep the shape to the right of the text; narrow ones center it behind, dimmed
  useEffect(() => {
    const wide = size.width / size.height > 1.1
    material.uniforms.uAspect.value = size.width / size.height
    material.uniforms.uOffset.value.set(wide ? 3.6 : 0, wide ? 0 : -1, 0)
    material.uniforms.uScale.value = wide ? 0.85 : 0.7
    material.uniforms.uDim.value = wide ? 1 : 0.5
  }, [size, material])

  // the canvas ignores pointer events so the text stays clickable, so track the cursor on the window
  useEffect(() => {
    function handleMove(e: PointerEvent) {
      if (e.pointerType !== 'mouse') return
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / size.height) * 2 + 1
      pointer.current.set(x, y)
      pointerActive.current = y > -1
    }
    function handleLeave() {
      pointerActive.current = false
    }
    window.addEventListener('pointermove', handleMove)
    document.addEventListener('pointerleave', handleLeave)
    return () => {
      window.removeEventListener('pointermove', handleMove)
      document.removeEventListener('pointerleave', handleLeave)
    }
  }, [size.height])

  useFrame(({ clock }, delta) => {
    const { uniforms } = material
    if (!reducedMotion) uniforms.uTime.value = clock.elapsedTime
    uniforms.uMorph.value = Math.min(1, uniforms.uMorph.value + delta * 0.55)
    uniforms.uScatter.value = reducedMotion ? 0 : scatter.get()
    uniforms.uPointer.value.lerp(pointer.current, 0.2)
    const target = pointerActive.current && !reducedMotion ? 1 : 0
    uniforms.uPointerStrength.value = THREE.MathUtils.lerp(uniforms.uPointerStrength.value, target, 0.08)
  })

  return <points geometry={geometry} material={material} />
}

interface HeroFieldProps {
  shape: number
  scatter: MotionValue<number>
  active: boolean
  dark: boolean
  reducedMotion: boolean
}

function HeroField({ shape, scatter, active, dark, reducedMotion }: HeroFieldProps) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 9], fov: 50 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none' }}
    >
      <Field shape={shape} scatter={scatter} dark={dark} reducedMotion={reducedMotion} />
      {dark && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.9} luminanceThreshold={0.15} luminanceSmoothing={0.4} mipmapBlur />
        </EffectComposer>
      )}
    </Canvas>
  )
}

export default HeroField
