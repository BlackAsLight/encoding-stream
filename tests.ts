import { assertEquals } from '@std/assert'
import { encodeBase64 } from '@std/encoding/base64'
import { encodeBase58 } from '@std/encoding/base58'
import { encodeBase32 } from '@std/encoding/base32'
import { DecodeBase64Stream, EncodeBase64Stream } from './base64.ts'
import { DecodeBase58Stream, EncodeBase58Stream } from './base58.ts'
import { DecodeBase32Stream, EncodeBase32Stream } from './base32.ts'
import { AsyncIter } from '@doctor/iterstar'

Deno.test(async function encodeBase64Test() {
	assertEquals(
		await new AsyncIter((await Deno.open('./deno.json')).readable.pipeThrough(new EncodeBase64Stream())).join(''),
		encodeBase64(await Deno.readFile('./deno.json')),
	)
})

Deno.test(async function decodeBase64Test() {
	assertEquals(
		await new AsyncIter(
			(await Deno.open('./deno.json')).readable
				.pipeThrough(new EncodeBase64Stream())
				.pipeThrough(new DecodeBase64Stream()),
		).reduce((x, y) => {
			const z = new Uint8Array(x.length + y.length)
			z.set(x)
			z.set(y, x.length)
			return z
		}),
		await Deno.readFile('./deno.json'),
	)
})

Deno.test(async function encodeBas58Test() {
	assertEquals(
		await new AsyncIter((await Deno.open('./deno.json')).readable.pipeThrough(new EncodeBase58Stream())).join(''),
		encodeBase58(await Deno.readFile('./deno.json')),
	)
})

Deno.test(async function decodeBase58Test() {
	assertEquals(
		await new AsyncIter(
			(await Deno.open('./deno.json')).readable
				.pipeThrough(new EncodeBase58Stream())
				.pipeThrough(new DecodeBase58Stream()),
		).reduce((x, y) => {
			const z = new Uint8Array(x.length + y.length)
			z.set(x)
			z.set(y, x.length)
			return z
		}),
		await Deno.readFile('./deno.json'),
	)
})

Deno.test(async function encodeBase32Test() {
	assertEquals(
		await new AsyncIter((await Deno.open('./deno.json')).readable.pipeThrough(new EncodeBase32Stream())).join(''),
		encodeBase32(await Deno.readFile('./deno.json')),
	)
})

Deno.test(async function decodeBase32Test() {
	assertEquals(
		await new AsyncIter(
			(await Deno.open('./deno.json')).readable
				.pipeThrough(new EncodeBase32Stream())
				.pipeThrough(new DecodeBase32Stream()),
		).reduce((x, y) => {
			const z = new Uint8Array(x.length + y.length)
			z.set(x)
			z.set(y, x.length)
			return z
		}),
		await Deno.readFile('./deno.json'),
	)
})
