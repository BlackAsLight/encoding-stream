import { assertEquals } from '@std/assert'
import { encodeBase64Url } from 'jsr:@std/encoding@0/base64url'
import { encodeBase64 } from '@std/encoding/base64'
import { encodeBase32 } from '@std/encoding/base32'
import { encodeHex } from '@std/encoding/hex'
import { DecodeBase64UrlStream, EncodeBase64UrlStream } from './base64url.ts'
import { DecodeBase64Stream, EncodeBase64Stream } from './base64.ts'
import { DecodeBase32Stream, EncodeBase32Stream } from './base32.ts'
import { DecodeHexStream, EncodeHexStream } from './hex.ts'

async function readable() {
	return (await Deno.open('./deno.json')).readable
}

function uInt8Array() {
	return Deno.readFile('./deno.json')
}

async function join(iterable: AsyncIterable<string>) {
	let x = ''
	for await (const y of iterable) x += y
	return x
}

async function reduce(iterable: AsyncIterable<Uint8Array>) {
	let x = new Uint8Array(0)
	for await (const y of iterable) {
		const z = new Uint8Array(x.length + y.length)
		z.set(x)
		z.set(y, x.length)
		x = z
	}
	return x
}

Deno.test(async function encodeBase64UrlTest() {
	assertEquals(await join((await readable()).pipeThrough(new EncodeBase64UrlStream())), encodeBase64Url(await uInt8Array()))
})

Deno.test(async function decodeBase64UrlTest() {
	assertEquals(
		await reduce((await readable()).pipeThrough(new EncodeBase64UrlStream()).pipeThrough(new DecodeBase64UrlStream())),
		await uInt8Array(),
	)
})

Deno.test(async function encodeBase64Test() {
	assertEquals(await join((await readable()).pipeThrough(new EncodeBase64Stream())), encodeBase64(await uInt8Array()))
})

Deno.test(async function decodeBase64Test() {
	assertEquals(
		await reduce((await readable()).pipeThrough(new EncodeBase64Stream()).pipeThrough(new DecodeBase64Stream())),
		await uInt8Array(),
	)
})

Deno.test(async function encodeBase32Test() {
	assertEquals(await join((await readable()).pipeThrough(new EncodeBase32Stream())), encodeBase32(await uInt8Array()))
})

Deno.test(async function decodeBase32Test() {
	assertEquals(
		await reduce((await readable()).pipeThrough(new EncodeBase32Stream()).pipeThrough(new DecodeBase32Stream())),
		await uInt8Array(),
	)
})

Deno.test(async function encodeHexTest() {
	assertEquals(await join((await readable()).pipeThrough(new EncodeHexStream())), encodeHex(await uInt8Array()))
})

Deno.test(async function decodeHexTest() {
	assertEquals(
		await reduce((await readable()).pipeThrough(new EncodeHexStream()).pipeThrough(new DecodeHexStream())),
		await uInt8Array(),
	)
})
