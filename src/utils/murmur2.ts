export function murmur2(key: string | Buffer, seed: number) {
  seed = seed || 0x01234567;
  let l = key.length;
  let h = seed ^ l;
  let i = 0;
  let k;

  if (!Buffer.isBuffer(key)) {
    key = new Buffer(key);
  }

  while (l >= 4) {
    k = key.readInt32LE(i);
    k = (k & 0xffff) * 0x5bd1e995 + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16);
    k ^= k >>> 24;
    k = (k & 0xffff) * 0x5bd1e995 + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16);
    h = ((h & 0xffff) * 0x5bd1e995 + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16)) ^ k;
    l -= 4;
    i += 4;
  }

  switch (l) {
    case 3:
      h ^= (key[i + 2] & 0xff) << 16;
    case 2:
      h ^= (key[i + 1] & 0xff) << 8;
    case 1:
      h ^= key[i] & 0xff;
      h = (h & 0xffff) * 0x5bd1e995 + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16);
  }

  h ^= h >>> 13;
  h = (h & 0xffff) * 0x5bd1e995 + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16);
  h ^= h >>> 15;

  return h >>> 0;
}
