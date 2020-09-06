# b64web

Base64 and Base64URL ([RFC 4648](https://tools.ietf.org/html/rfc4648)) encoding/decoding/validation for web browsers

[![npm](https://img.shields.io/npm/v/b64web)](https://www.npmjs.com/package/b64web)
[![npm bundle size](https://img.shields.io/bundlephobia/min/b64web)](https://bundlephobia.com/result?p=b64web)
[![Top Language](https://img.shields.io/github/languages/top/gadicuz/b64web)](https://github.com/gadicuz/b64web)
[![MIT License](https://img.shields.io/github/license/gadicuz/b64web)](https://github.com/Gadicuz/b64web/blob/master/LICENSE)


# Features

* Encodes binary data or text string to Base64 or Base64URL data.
* Decodes Base64 or Base64URL data to binary data or text string.
* Autodetects alphabets and padding.
* Validates Base64/Base64URL data, respects [canonical encodings](https://tools.ietf.org/html/rfc4648#section-3.5).
* ES6 module, typings available

# Install

```bash
npm i b64web
```

# Usage

```typescript
let b64s: string; // Base64/Base64URL encoded ASCII string
let data: ArrayBuffer; // binary data
let text: string; //text string data
```

### Decoding Base64 data

```typescript
// decode 'b64s' to binary data
data = decode(b64s);
// decode 'b64s' to binary data, convert the data to text string using text decoder 'decoder'
text = decode(b64s, decoder);
```

### Encoding Base64 data

```typescript
// encode binary data 'data' to Base64 ASCII string
b64s = encode(data);
// encode binary data 'data' to Base64URL ASCII string
b64s = encode(data, { urlsafe: true }); 
// encode text sting 'text' to binary data, convert to Base64 ASCII string
b64s = encode(text);
```

### Validating Base64 data

```typescript
// validate Base64/Base64URL encoded ASCII string
let valid = validate(b64s);
```

## Examples

```typescript
import * as B64 from 'b64web';

const s1 = 'foob';
const s2 = '\u{1F601} \u{1F4A3}!'; // '😁 💣!'
const buf = Uint32Array.from([0xFFFFFFF8]).buffer; // [248,255,255,255]

// Encode text string
const e1 = B64.encode(s1); // 'Zm9vYg=='
const e2 = B64.encode(s1, { nopadding: true }); // 'Zm9vYg'
const e3 = B64.encode(s2); // '8J+YgSDwn5KjIQ=='
const e4 = B64.encode(s2, { urlsafe: true, nopadding: true }); // '8J-YgSDwn5KjIQ'

// Decode to text string
const t1 = B64.decode(e1, 'utf-8'); // 'foob'
const t2 = B64.decode(e2, 'utf-8'); // 'foob'
const t3 = B64.decode(e3, 'utf-8'); // '😁 💣!'
const t4 = B64.decode(e4, 'utf-8'); // '😁 💣!'

// Decode to binary data
const b1 = B64.decode(e1); // [102,111,111,98]
const b2 = B64.decode(e2); // [102,111,111,98]
const b3 = B64.decode(e3); // [240,159,152,129,32,240,159,146,163,33]
const b4 = B64.decode(e4); // [240,159,152,129,32,240,159,146,163,33]

// Encode binary data
const x1 = B64.encode(b1); // 'Zm9vYg=='
const x2 = B64.encode(b3, { nopadding: true }); // '8J+YgSDwn5KjIQ'
const x3 = B64.encode(buf); // '+P///w=='
const x4 = B64.encode(buf, { urlsafe: true }); // '-P___w=='

// Validate
const v1 = B64.validate('Zm9vYg=='); // true
const v2 = B64.validate('Zm9vYg'); // true
const v3 = B64.validate('Zm9vYg', { nopadding: false }); // false, padding required
const v4 = B64.validate('Zm9vYh=='); // false, non-canonical
const v5 = B64.validate('8J-YgSDwn5KjIQ'); // true
const v6 = B64.validate('8J-YgSDwn5KjIQ', { urlsafe: false } ); // false, BASE64 required
const v7 = B64.validate('8J+YgSDwn5KjIQ', { urlsafe: true } ); // false, BASE64URL required

// TEXT <-> BINARY
const c1 = B64.stob(s1); // [102,111,111,98]
const d1 = B64.btos(c1); // 'foob'
```

Encoding a text string is equivalent to converting the text string to a binary buffer and encoding the buffer.
```
encode(text, { encoder }) === encode(stob(text, encoder))
```

Decoding Base64 data to text string is equivalent to decoding the data to binary buffer and converting the buffer.

```
decode(data, decoder) === btos(decode(data), decoder)
```
