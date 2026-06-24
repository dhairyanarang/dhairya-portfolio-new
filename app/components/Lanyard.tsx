/* eslint-disable react/no-unknown-property */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei'
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  RigidBodyProps,
} from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import * as THREE from 'three'

// Assets live in /public (Next.js does not bundle .glb/.png module imports).
const CARD_GLB = '/lanyard/card.glb'
const DEFAULT_BAND = '/lanyard/strap1.png'

extend({ MeshLineGeometry, MeshLineMaterial })
useGLTF.preload(CARD_GLB)

// Register the meshline elements with R3F's JSX namespace.
declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: any
    meshLineMaterial: any
  }
}

// 1x1 transparent pixel — lets useTexture be called unconditionally when a
// front/back image isn't supplied.
const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

// Card dimensions. The art is 800×1130 (1 : 1.4125 ≈ 1 : 1.41). The plane and the
// physics collider share the same footprint so the visual and the hit-box line up.
// CARD_SCALE makes the card read a little larger on screen (collider scaled to match).
const CARD_SCALE = 1.2
const CARD_W = 0.8 * 2 * CARD_SCALE
const CARD_H = 1.125 * 2 * CARD_SCALE

interface LanyardProps {
  position?: [number, number, number]
  gravity?: [number, number, number]
  fov?: number
  transparent?: boolean
  frontImage?: string | null
  backImage?: string | null
  /** Texture tiled along the lanyard strap. */
  bandTexture?: string | null
  /** meshline lineWidth for the strap. */
  lanyardWidth?: number
  /** Scene-space position of the fixed top anchor — x shifts the whole lanyard horizontally. */
  anchor?: [number, number, number]
}

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  bandTexture = DEFAULT_BAND,
  lanyardWidth = 1,
  anchor = [0, 4, 0],
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState<boolean>(
    () => typeof window !== 'undefined' && window.innerWidth < 768,
  )

  useEffect(() => {
    const handleResize = (): void => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    // Fills the (sticky) wrapper supplied by the page. pointer-events:none lets
    // clicks fall through; <Band> re-enables pointer-events on the <canvas> only
    // while the cursor is actually over the card.
    <div style={{ position: 'relative', width: '100%', height: '100%', pointerEvents: 'none' }}>
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        style={{ pointerEvents: 'none' }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)
          // The <Band> raycast flips this to 'auto' only when over the card.
          gl.domElement.style.pointerEvents = 'none'
        }}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band
            isMobile={isMobile}
            frontImage={frontImage}
            backImage={backImage}
            bandTexture={bandTexture}
            lanyardWidth={lanyardWidth}
            anchor={anchor}
          />
        </Physics>
        {/* Environment lights the metal clasp (the card itself is unlit/meshBasic). */}
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  )
}

interface BandProps {
  maxSpeed?: number
  minSpeed?: number
  isMobile?: boolean
  frontImage?: string | null
  backImage?: string | null
  bandTexture?: string | null
  lanyardWidth?: number
  anchor?: [number, number, number]
}

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  frontImage = null,
  backImage = null,
  bandTexture = DEFAULT_BAND,
  lanyardWidth = 1,
  anchor = [0, 4, 0],
}: BandProps) {
  // Using "any" for refs since the exact types depend on Rapier's internals.
  const band = useRef<any>(null)
  const fixed = useRef<any>(null)
  const j1 = useRef<any>(null)
  const j2 = useRef<any>(null)
  const j3 = useRef<any>(null)
  const card = useRef<any>(null)
  // The visual card group — used for the pointer-events raycast below.
  const cardVisual = useRef<any>(null)

  const vec = new THREE.Vector3()
  const ang = new THREE.Vector3()
  const rot = new THREE.Vector3()
  const dir = new THREE.Vector3()

  // High, equal damping so the card swings gently and settles instead of
  // bouncing/jittering; canSleep lets it go fully still at rest.
  const segmentProps: any = {
    type: 'dynamic' as RigidBodyProps['type'],
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4,
  }

  const { nodes, materials } = useGLTF(CARD_GLB) as any

  // Front face (+Z) and back face (−Z) are independent textures, mapped 1:1 onto
  // the plane (no stretch / no atlas resample). useTexture must be called
  // unconditionally; fall back to a blank pixel when an image isn't supplied.
  const frontTex = useTexture(frontImage || BLANK_PIXEL)
  const backTex = useTexture(backImage || BLANK_PIXEL)
  const bandTex = useTexture(bandTexture || DEFAULT_BAND)

  useEffect(() => {
    for (const t of [frontTex, backTex]) {
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = 16
      t.needsUpdate = true
    }
  }, [frontTex, backTex])

  const [curve] = useState(
    () => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]),
  )
  const [dragged, drag] = useState<false | THREE.Vector3>(false)
  const [hovered, hover] = useState(false)

  // Fixed anchor → 3 rope segments → spherical joint at the metal clasp's loop.
  // react-bits' value is 1.45; it scales with CARD_SCALE so the band keeps meeting
  // the (also-scaled) clasp loop rather than poking into the bigger card.
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45 * CARD_SCALE, 0],
  ])

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab'
      return () => {
        document.body.style.cursor = 'auto'
      }
    }
  }, [hovered, dragged])

  // The overlay <canvas> is pointer-events:none so clicks fall through to the
  // page. We track the raw client pointer (independent of the canvas) and, in
  // the frame loop, convert it to NDC against the canvas's live bounding rect
  // (the canvas scrolls with the page), then flip pointer-events to 'auto' only
  // when the ray actually hits the card.
  const { gl } = useThree()
  const clientPt = useRef({ x: -1, y: -1 })
  const pointerNDC = useRef(new THREE.Vector2(2, 2)) // start off-screen
  const rectRef = useRef<DOMRect | null>(null)
  // Touch: the selective pointer-events below is hover-based, and touch has no
  // hover — so a deliberate double-tap on the card "arms" it, keeping the canvas
  // interactive long enough to then touch-drag it. Mouse is unaffected (no touch
  // events fire), so desktop behaviour is unchanged.
  const armedRef = useRef(false)
  const disarmTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      clientPt.current.x = e.clientX
      clientPt.current.y = e.clientY
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
  // Cache the canvas rect (only refreshed on scroll/resize) so the per-frame
  // pointer raycast never forces a synchronous layout read — that read was the
  // main source of jitter while moving the cursor over the card.
  useEffect(() => {
    const el = gl.domElement
    const update = () => {
      rectRef.current = el.getBoundingClientRect()
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [gl])

  // Double-tap over the card arms touch-drag for a few seconds (then you drag).
  useEffect(() => {
    let lastTap = 0, lastX = 0, lastY = 0
    let downT = 0, downX = 0, downY = 0
    const inRect = (x: number, y: number) => {
      const r = rectRef.current
      return !!r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom
    }
    const onStart = (e: TouchEvent) => {
      const t = e.touches[0]
      if (t) { downT = Date.now(); downX = t.clientX; downY = t.clientY }
    }
    const onEnd = (e: TouchEvent) => {
      const t = e.changedTouches[0]
      if (!t) return
      const quickTap = Date.now() - downT < 260 && Math.hypot(t.clientX - downX, t.clientY - downY) < 22
      if (!quickTap || !inRect(t.clientX, t.clientY)) { lastTap = 0; return }
      const now = Date.now()
      if (now - lastTap < 350 && Math.hypot(t.clientX - lastX, t.clientY - lastY) < 44) {
        // Armed: keep the canvas interactive (see useFrame) so the next touch can drag.
        armedRef.current = true
        clientPt.current.x = t.clientX; clientPt.current.y = t.clientY
        if (disarmTimer.current) clearTimeout(disarmTimer.current)
        disarmTimer.current = setTimeout(() => { armedRef.current = false }, 5000)
        e.preventDefault() // suppress any double-tap zoom
        lastTap = 0
      } else {
        lastTap = now; lastX = t.clientX; lastY = t.clientY
      }
    }
    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchend', onEnd, { passive: false })
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchend', onEnd)
      if (disarmTimer.current) clearTimeout(disarmTimer.current)
    }
  }, [])

  useFrame((state, delta) => {
    if (dragged && typeof dragged !== 'boolean') {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp())
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      })
    }
    if (fixed.current) {
      ;[j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation())
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())))
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)))
      })
      curve.points[0].copy(j3.current.translation())
      curve.points[1].copy(j2.current.lerped)
      curve.points[2].copy(j1.current.lerped)
      curve.points[3].copy(fixed.current.translation())
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32))
      // Gentle perpetual sway at rest: a soft "breeze" pushes the card with a
      // tiny oscillating force so it never sits dead-still. Two slow sine waves of
      // different periods keep the motion organic rather than mechanical; the rope
      // follows naturally via physics. The force is sized to the card's mass and
      // damping so peak speed stays barely above the old sleep threshold (subtle).
      if (!dragged) {
        const t = state.clock.elapsedTime
        const force = (Math.sin(t * 0.5) + 0.6 * Math.sin(t * 0.21)) * 0.12
        ;[j1, j2, j3, card].forEach((ref) => ref.current?.wakeUp())
        card.current.applyImpulse({ x: force * delta, y: 0, z: 0 }, true)
        // keep the card gently facing forward while it sways
        rot.copy(card.current.rotation())
        ang.copy(card.current.angvel())
        if (Math.abs(rot.y) > 0.02) {
          card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.1, z: ang.z })
        }
      }
    }

    // Selective pointer-events: capture only over the card (or while dragging).
    const el = state.gl.domElement
    let want: 'auto' | 'none' = 'none'
    if (dragged || armedRef.current) {
      want = 'auto'
    } else if (cardVisual.current && rectRef.current) {
      const rect = rectRef.current
      if (rect.width > 0 && rect.height > 0) {
        pointerNDC.current.set(
          ((clientPt.current.x - rect.left) / rect.width) * 2 - 1,
          -((clientPt.current.y - rect.top) / rect.height) * 2 + 1,
        )
        state.raycaster.setFromCamera(pointerNDC.current, state.camera)
        if (state.raycaster.intersectObject(cardVisual.current, true).length > 0) want = 'auto'
      }
    }
    if (el.style.pointerEvents !== want) el.style.pointerEvents = want
  })

  curve.curveType = 'chordal'
  bandTex.wrapS = bandTex.wrapT = THREE.RepeatWrapping
  bandTex.colorSpace = THREE.SRGBColorSpace

  // Tile the band so its texture stays undistorted. This band's length:width is
  // ~16.4 (react-bits' repeat of 4 × their 1025/250 ≈ 4.1 texture aspect), so the
  // tile count = 16.4 / textureAspect, also scaled down as the band widens. A
  // 1025×250 (4.1:1) texture → ~4 tiles; a square texture → ~16.
  const texAspect =
    bandTex.image && bandTex.image.width && bandTex.image.height
      ? bandTex.image.width / bandTex.image.height
      : 1025 / 250
  const bandRepeat = 16.4 / (lanyardWidth * texAspect)

  // Raise the fixed anchor by exactly how far the spherical joint moved up with
  // CARD_SCALE, so the card keeps its original rest position while the scaled
  // clasp stays attached to the card's top.
  const topAnchor: [number, number, number] = [anchor[0], anchor[1] + 1.45 * (CARD_SCALE - 1), anchor[2]]

  return (
    <>
      <group position={topAnchor}>
        <RigidBody ref={fixed} {...segmentProps} type={'fixed' as RigidBodyProps['type']} />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps} type={'dynamic' as RigidBodyProps['type']}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps} type={'dynamic' as RigidBodyProps['type']}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps} type={'dynamic' as RigidBodyProps['type']}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? ('kinematicPosition' as RigidBodyProps['type']) : ('dynamic' as RigidBodyProps['type'])}
        >
          <CuboidCollider args={[0.8 * CARD_SCALE, 1.125 * CARD_SCALE, 0.01]} />
          <group
            ref={cardVisual}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: any) => {
              e.target.releasePointerCapture(e.pointerId)
              drag(false)
              armedRef.current = false
              if (disarmTimer.current) clearTimeout(disarmTimer.current)
            }}
            onPointerDown={(e: any) => {
              e.target.setPointerCapture(e.pointerId)
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
            }}
          >
            {/* Front face (+Z). Unlit (meshBasic) + toneMapped:false keeps the
                colours pixel-accurate to the source art. alphaTest cuts the art's
                rounded transparent corners so they don't show as black wedges. */}
            <mesh position={[0, 0, 0.01]}>
              <planeGeometry args={[CARD_W, CARD_H]} />
              <meshBasicMaterial map={frontTex} side={THREE.FrontSide} transparent alphaTest={0.5} toneMapped={false} />
            </mesh>
            {/* Back face (−Z): rotated π about Y so its front side faces −Z (not mirrored). */}
            <mesh position={[0, 0, -0.01]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[CARD_W, CARD_H]} />
              <meshBasicMaterial map={backTex} side={THREE.FrontSide} transparent alphaTest={0.5} toneMapped={false} />
            </mesh>
            {/* Metal clasp (clip + clamp) from the GLB. react-bits' transform is
                scale 2.25 / position [0,-1.2,-0.05]; scaling both by CARD_SCALE keeps
                the clasp attached to the (enlarged) card's top hole exactly. */}
            <group scale={2.25 * CARD_SCALE} position={[0, -1.2 * CARD_SCALE, -0.05 * CARD_SCALE]}>
              <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
              <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
            </group>
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={bandTex}
          repeat={[-bandRepeat, 1]}
          lineWidth={lanyardWidth}
          toneMapped={false}
        />
      </mesh>
    </>
  )
}
