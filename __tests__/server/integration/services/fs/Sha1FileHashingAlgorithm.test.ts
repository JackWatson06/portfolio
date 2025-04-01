import { Sha1FileHashingAlgorithm } from "@/services/fs/Sha1FileHashingAlgorithm";

test("hashing buffer data", () => {
  const sha1_hashing_algo = new Sha1FileHashingAlgorithm();

  const hash = sha1_hashing_algo.hash(Buffer.from([0x01, 0x02, 0x03]));

  expect(hash).toBe("7037807198c22a7d2b0807371d763779a84fdfcf");
});

test("two hashes of buffer data are different", () => {
  const sha1_hashing_algo = new Sha1FileHashingAlgorithm();
  const hash_one = sha1_hashing_algo.hash(Buffer.from([0x01, 0x02, 0x03]));
  const hash_two = sha1_hashing_algo.hash(Buffer.from([0x01, 0x02, 0x04]));

  expect(hash_one).not.toBe(hash_two);
});
