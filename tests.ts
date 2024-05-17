import { assertEquals } from '@std/assert'
import { encodeBase64Url } from 'jsr:@std/encoding@0/base64url'
import { encodeBase64 } from '@std/encoding/base64'
import { encodeBase32 } from '@std/encoding/base32'
import { encodeHex } from '@std/encoding/hex'
import { DecodeBase64UrlStream, EncodeBase64UrlStream } from './base64url.ts'
import { DecodeBase64Stream, EncodeBase64Stream } from './base64.ts'
import { DecodeBase32Stream, EncodeBase32Stream } from './base32.ts'
import { DecodeHexStream, EncodeHexStream } from './hex.ts'

Deno.test(async function encodeBase64UrlTest() {
	assertEquals(
		(await Array.fromAsync(
			(await Deno.open('./deno.json')).readable
				.pipeThrough(new EncodeBase64UrlStream()),
		))
			.join(''),
		encodeBase64Url(await Deno.readFile('./deno.json')),
	)
})

Deno.test(async function decodeBase64UrlTest() {
	assertEquals(
		Uint8Array.from(
			(await Array.fromAsync(
				(await Deno.open('./deno.json')).readable
					.pipeThrough(new EncodeBase64UrlStream())
					.pipeThrough(new DecodeBase64UrlStream()),
			))
				.map((x) => [...x])
				.flat(),
		),
		await Deno.readFile('./deno.json'),
	)
})

Deno.test(async function encodeBase64Test() {
	assertEquals(
		(await Array.fromAsync(
			(await Deno.open('./deno.json')).readable
				.pipeThrough(new EncodeBase64Stream()),
		))
			.join(''),
		encodeBase64(await Deno.readFile('./deno.json')),
	)
})

Deno.test(async function decodeBase64Test() {
	assertEquals(
		Uint8Array.from(
			(await Array.fromAsync(
				(await Deno.open('./deno.json')).readable
					.pipeThrough(new EncodeBase64Stream())
					.pipeThrough(new DecodeBase64Stream()),
			))
				.map((x) => [...x])
				.flat(),
		),
		await Deno.readFile('./deno.json'),
	)
})

Deno.test(async function encodeBase32Test() {
	assertEquals(
		(await Array.fromAsync(
			(await Deno.open('./deno.json')).readable
				.pipeThrough(new EncodeBase32Stream()),
		))
			.join(''),
		encodeBase32(await Deno.readFile('./deno.json')),
	)
})

Deno.test(async function decodeBase32Test() {
	assertEquals(
		Uint8Array.from(
			(await Array.fromAsync(
				(await Deno.open('./deno.json')).readable
					.pipeThrough(new EncodeBase32Stream())
					.pipeThrough(new DecodeBase32Stream()),
			))
				.map((x) => [...x])
				.flat(),
		),
		await Deno.readFile('./deno.json'),
	)
})

Deno.test(async function encodeHexTest() {
	assertEquals(
		(await Array.fromAsync(
			(await Deno.open('./deno.json')).readable
				.pipeThrough(new EncodeHexStream()),
		))
			.join(''),
		encodeHex(await Deno.readFile('./deno.json')),
	)
})

Deno.test(async function decodeHexTest() {
	assertEquals(
		Uint8Array.from(
			(await Array.fromAsync(
				(await Deno.open('./deno.json')).readable
					.pipeThrough(new EncodeHexStream())
					.pipeThrough(new DecodeHexStream()),
			))
				.map((x) => [...x])
				.flat(),
		),
		await Deno.readFile('./deno.json'),
	)
})
