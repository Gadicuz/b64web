/** BASE64 options */
export interface Options {
  /** no padding */
  nopadding?: boolean;
  /** use BASE64URL alphabet */
  urlsafe?: boolean;
}
/*
  xxxx= 0123 4567 89AB CDEF
00xxxx: ABCD EFGH IJKL MNOP
01xxxx: QRST UVWX YZab cdef
10xxxx: ghij klmn opqr stuv
11xxxx: wxyz 0123 4567 89+/
*/
// [canonical encoding](https://tools.ietf.org/html/rfc4648#section-3.5)
const re_base64 = /^(?:[A-Za-z0-9+/]{4})*(?:(?:[A-Za-z0-9+/][AQgw](:?==)?)|(?:[A-Za-z0-9+/]{2}[AEIMQUYcgkosw048]=?))?$/;
//const re_base64_non_canonical = /^(?:[A-Za-z0-9+/]{4})*(?:(?:[A-Za-z0-9+/]{2}(:?==)?)|(?:[A-Za-z0-9+/]{3}=?))?$/;

/** Validates BASE64/BASE64URL encoded string.
 * @param b64s - input string
 * @param opt - options
 * @returns validation status
 */
export function validate(b64s: string, opt?: Options): boolean {
  opt = opt || {};
  if (opt.nopadding === false && b64s.length & 3) return false;
  if (opt.nopadding === true && b64s[b64s.length - 1] === '=') return false;
  if (opt.urlsafe !== false) {
    const b64 = /[+/]/.test(b64s);
    const b64u = /[-_]/.test(b64s);
    if (b64 && (b64u || opt.urlsafe === true)) return false; // BASE64 symbols in BASE64URL string
    if (b64u) b64s = b64s.replace(/-/g, '+').replace(/_/g, '/');
  }
  return re_base64.test(b64s);
}

/** Decodes BASE64/BASE64URL ASCII string, auto-detects BASE64URL encoding.
 *
 * Every 4 input symbols are converted to 3 output bytes.
 * Output bytes can be decoded to a text string.
 *
 * @param b64s - input BASE64/BASE64URL encoded string
 * @param decoder - text string encoding label or decoder
 * @returns binary data or text string
 */
export function decode(b64s: string): ArrayBuffer;
export function decode(b64s: string, decoder: string | TextDecoder): string;
export function decode(b64s: string, decoder?: string | TextDecoder): ArrayBuffer | string {
  if (!/[+/]/.test(b64s)) b64s = b64s.replace(/-/g, '+').replace(/_/g, '/');
  b64s += '='.repeat(-b64s.length & 3);
  const buf = Uint8Array.from(atob(b64s), (c) => c.charCodeAt(0));
  return decoder ? btos(buf, decoder) : buf.buffer;
}

/** Encodes binary array or text string to BASE64/BASE64URL ASCII string.
 *
 * If input data is a text string, the string is converted to binary data according to opt.encoder, 'utf-8' by default.
 * Every 3 input bytes are converted to 4 output symbols.
 *
 * @param data - input binary data or text string
 * @param opt - encoding options and text encoder
 * @returns BASE64 or BASE64URL encoded string
 */
export function encode(data: ArrayBuffer | string, opt?: Options & { encoder?: `utf-8` | TextEncoder }): string {
  opt = opt || {};
  let s = btoa(String.fromCharCode(...new Uint8Array(typeof data === 'string' ? stob(data, opt.encoder) : data)));
  if (opt.urlsafe) s = s.replace(/\+/g, '-').replace(/\//g, '_');
  if (opt.nopadding === true) s = s.replace(/=/g, '');
  return s;
}

/** Converts binary buffer to text string. Buffer data is utf-8 encoded by default.
 * @param buf - input binary data
 * @param decoder - encoding label or custom decoder
 * @returns text string
 */
export function btos(buf: ArrayBuffer, decoder?: string | TextDecoder): string {
  decoder = typeof decoder === 'string' ? new TextDecoder(decoder) : decoder || new TextDecoder();
  return decoder.decode(buf);
}

/** Converts text string to binary buffer. Buffer data is utf-8 encoded by default.
 * @param s - input string
 * @param encoder - `utf-8` or custom encoder
 * @returns binary data
 */
export function stob(s: string, encoder?: `utf-8` | TextEncoder): ArrayBuffer {
  encoder = encoder === 'utf-8' ? new TextEncoder() : encoder || new TextEncoder();
  return encoder.encode(s);
}
