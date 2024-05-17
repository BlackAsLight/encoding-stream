# Encoding Stream

Encoding Stream is a simple lib offering Streaming methods of the [@std/encoding](https://jsr.io/@std/encoding) module.

```ts
import { DecodeBase64Stream, EncodeBase64Stream } from '@doctor/encoding-stream'

await (await Deno.open('./deno.json'))
	.readable
	.pipeThrough(new EncodeBase64Stream())
	.pipeThrough(new DecodeBase64Stream())
	.pipeTo(Deno.stdout.writable)
```
