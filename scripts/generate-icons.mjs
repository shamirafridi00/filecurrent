// One-off generator for public/favicon.ico (16/32/48) and
// public/apple-touch-icon.png (180×180). No dependencies — rasterizes the
// FileCurrent bolt mark and encodes PNG/ICO by hand.
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const INDIGO = [0x63, 0x5b, 0xff]
const WHITE = [0xff, 0xff, 0xff]
// Bolt polygon in a 40×40 design space (matches LogoMark.tsx)
const BOLT = [[23.5, 4.5], [10.5, 22.5], [18, 22.5], [16.5, 35.5], [29.5, 17.5], [22, 17.5]]
const CORNER_RADIUS = 9 // of 40

function pointInPolygon(px, py, poly) {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
      inside = !inside
    }
  }
  return inside
}

function inRoundedSquare(x, y, size, radius) {
  if (x < 0 || y < 0 || x > size || y > size) return false
  const r = radius
  const cx = x < r ? r : x > size - r ? size - r : null
  const cy = y < r ? r : y > size - r ? size - r : null
  if (cx === null || cy === null) return true
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r
}

// Render RGBA pixels with 4×4 supersampling. `rounded: false` fills the
// full square (apple-touch-icon — iOS applies its own mask).
function render(size, { rounded }) {
  const px = Buffer.alloc(size * size * 4)
  const SS = 4
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let bg = 0, bolt = 0
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          // Sample position in 40×40 design space
          const dx = ((x + (sx + 0.5) / SS) / size) * 40
          const dy = ((y + (sy + 0.5) / SS) / size) * 40
          const inSquare = rounded
            ? inRoundedSquare(dx, dy, 40, CORNER_RADIUS)
            : true
          if (inSquare) {
            bg++
            if (pointInPolygon(dx, dy, BOLT)) bolt++
          }
        }
      }
      const total = SS * SS
      const alpha = Math.round((bg / total) * 255)
      const boltFrac = bg > 0 ? bolt / bg : 0
      const i = (y * size + x) * 4
      px[i] = Math.round(INDIGO[0] + (WHITE[0] - INDIGO[0]) * boltFrac)
      px[i + 1] = Math.round(INDIGO[1] + (WHITE[1] - INDIGO[1]) * boltFrac)
      px[i + 2] = Math.round(INDIGO[2] + (WHITE[2] - INDIGO[2]) * boltFrac)
      px[i + 3] = rounded ? alpha : 255
    }
  }
  return px
}

// ── Minimal PNG encoder ──
const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()

function crc32(buf) {
  let c = 0xffffffff
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeData = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(typeData))
  return Buffer.concat([len, typeData, crc])
}

function encodePng(size, rgba) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8  // bit depth
  ihdr[9] = 6  // RGBA
  const raw = Buffer.alloc(size * (size * 4 + 1))
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0 // filter: none
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4)
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// ── ICO container (PNG-encoded entries) ──
function encodeIco(entries) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(entries.length, 4)
  const dirs = []
  const blobs = []
  let offset = 6 + entries.length * 16
  for (const { size, png } of entries) {
    const dir = Buffer.alloc(16)
    dir[0] = size >= 256 ? 0 : size
    dir[1] = size >= 256 ? 0 : size
    dir[4] = 1 // planes (low byte)
    dir[6] = 32 // bpp (low byte)
    dir.writeUInt32LE(png.length, 8)
    dir.writeUInt32LE(offset, 12)
    offset += png.length
    dirs.push(dir)
    blobs.push(png)
  }
  return Buffer.concat([header, ...dirs, ...blobs])
}

mkdirSync(join(root, 'public'), { recursive: true })

const icoEntries = [16, 32, 48].map((size) => ({
  size,
  png: encodePng(size, render(size, { rounded: true })),
}))
writeFileSync(join(root, 'public', 'favicon.ico'), encodeIco(icoEntries))
console.log('Wrote public/favicon.ico (16, 32, 48)')

writeFileSync(
  join(root, 'public', 'apple-touch-icon.png'),
  encodePng(180, render(180, { rounded: false }))
)
console.log('Wrote public/apple-touch-icon.png (180×180)')
