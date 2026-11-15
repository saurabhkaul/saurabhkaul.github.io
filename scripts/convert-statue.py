"""Convert the CC0 MeshCraft Venus bust to position/normal/index GPU data.
Usage: python3 scripts/convert-statue.py /path/to/venus-de-milo.mcfig
Source and license: assets/models/ATTRIBUTION.md
"""
import json
import math
from pathlib import Path
import struct
import sys

raw = Path(sys.argv[1]).read_bytes()
assert raw[:8] == b'MCFIG\0\0\0'
length = struct.unpack_from('<I', raw, 8)[0]
header = json.loads(raw[12:12 + length])
start = ((12 + length + 7) // 8) * 8
count = header['vertices']
points = list(struct.iter_unpack('<fff', raw[start:start + count * 12]))
faces = list(struct.iter_unpack('<III', raw[start + count * 12:]))
# Source is Z-up and faces -Y. Convert to Y-up facing +Z.
points = [(x, z, -y) for x, y, z in points]
low = [min(p[i] for p in points) for i in range(3)]
high = [max(p[i] for p in points) for i in range(3)]
center = [(a + b) / 2 for a, b in zip(low, high)]
scale = 2.3 / (high[1] - low[1])
points = [tuple((p[i] - center[i]) * scale for i in range(3)) for p in points]
normals = [[0., 0., 0.] for _ in points]
for face in faces:
    a, b, c = [points[i] for i in face]
    u = [b[i] - a[i] for i in range(3)]
    v = [c[i] - a[i] for i in range(3)]
    n = [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]]
    for vertex in face:
        for i in range(3): normals[vertex][i] += n[i]
out = bytearray(struct.pack('<II', count, len(faces) * 3))
for p, n in zip(points, normals):
    length = math.sqrt(sum(x*x for x in n)) or 1
    out += struct.pack('<ffffff', *p, *(x/length for x in n))
for face in faces: out += struct.pack('<III', *face)
Path('assets/models/venus.bin').write_bytes(out)
print(f'{count} vertices, {len(faces)} triangles, {len(out)} bytes; bounds {low} / {high}')
