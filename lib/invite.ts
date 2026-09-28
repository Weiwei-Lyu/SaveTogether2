const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function createInviteCode() {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => ALPHABET[byte % ALPHABET.length]).join("");
}
