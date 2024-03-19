# Encoding Stream

Encoding Stream is a simple lib offering Streaming methods of the [@std/encoding](https://jsr.io/@std/encoding) module.

```ts
import { DecodeBase64Stream, EncodeBase64Stream } from '@doctor/encoding-stream'

(await Deno.open('./deno.json'))
	.readable
	.pipeThrough(new EncodingBase64Stream())
	.pipeThrough(new DecodingBase64Stream())
	.pipeTo(Deno.stdout.writable)
```
