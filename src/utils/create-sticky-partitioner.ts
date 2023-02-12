import { murmur2 } from "./murmur2";
// The Java client's seed https://github.com/apache/kafka/blob/1.0/clients/src/main/java/org/apache/kafka/common/utils/Utils.java#L355
const SEED = 0x9747b28c;

const _toPositive = (n: number) => {
  return n & 0x7fffffff;
};

export const partition = (key: string, partitionCount: number) => {
  const buf = Buffer.isBuffer(key) ? key : Buffer.from(key);
  console.log(murmur2(buf, SEED));
  return _toPositive(murmur2(buf, SEED)) % partitionCount;
};
