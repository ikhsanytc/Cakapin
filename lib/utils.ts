import { decode, encode } from "base-64"; //<<==yarn add base-64 if not available
// Convert base64 to blob
export function base64ToUint8Array(base64: string) {
  try {
    const binaryString = decode(base64); // Decode base64
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes; //<<==blob
  } catch (err) {
    return null;
  }
}
