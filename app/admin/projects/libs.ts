/**
 * The below function is not tested with unit tests. JSDom does not support blob APIs and the crypto
 * API so I would have to do a bunch of polyfilling which was not worth the effort for a small
 * function. Be warned!
 */
export async function sha1HashBlob(blob: Blob) {
  const array_buffer = await blob.arrayBuffer();

  const digest_buffer = await crypto.subtle.digest("SHA-1", array_buffer);
  return [...new Uint8Array(digest_buffer)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}
