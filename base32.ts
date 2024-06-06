/**
 * @module
 * This module offers streaming methods for to and from base32 and Uint8Array.
 */

import { decodeBase32, encodeBase32 } from '@std/encoding/base32'

/**
 * Based off the @std/encoding module, offering a streaming alternative for `encodeBase32`
 *
 * @example
 * ```ts
 * import { EncodeBase32Stream } from '@doctor/encoding-stream/base32'
 *
 * await (await Deno.open('./deno.json'))
 *   .readable
 *   .pipeThrough(new EncodeBase32Stream())
 *   .pipeThrough(new TextEncoderStream())
 *   .pipeTo((await Deno.create('./base32.txt')).writable)
 * ```
 */
export class EncodeBase32Stream extends TransformStream<Uint8Array, string> {
	constructor() {
		super(
			{
				push: new Uint8Array(0),
				transform(chunk, controller) {
					const concat = new Uint8Array(this.push.length + chunk.length)
					concat.set(this.push)
					concat.set(chunk, this.push.length)

					const remainder = -concat.length % 5
					controller.enqueue(
						encodeBase32(concat.slice(0, remainder || undefined)),
					)
					this.push = remainder ? concat.slice(remainder) : new Uint8Array(0)
				},
				flush(controller) {
					controller.enqueue(encodeBase32(this.push))
				},
			} as Transformer<Uint8Array, string> & { push: Uint8Array },
		)
	}
}

/**
 * Based off the @std/encoding module, offering a streaming alternative for `decodeBase32`
 *
 * @example
 * ```ts
 * import { DecodeBase32Stream } from '@doctor/encoding-stream/base32'
 *
 * await (await Deno.open('./base32.txt'))
 *   .readable
 *   .pipeThrough(new TextDecoderStream())
 *   .pipeThrough(new DecodeBase32Stream())
 *   .pipeTo((await Deno.create('./deno.json')).writable)
 */
export class DecodeBase32Stream extends TransformStream<string, Uint8Array> {
	constructor() {
		super(
			{
				push: '',
				transform(chunk, controller) {
					this.push += chunk
					if (this.push.length < 8) {
						return
					}
					const remainder = -this.push.length % 8
					controller.enqueue(decodeBase32(this.push.slice(0, remainder || undefined)))
					this.push = remainder ? this.push.slice(remainder) : ''
				},
				flush(controller) {
					if (this.push.length) controller.enqueue(decodeBase32(this.push))
				},
			} as Transformer<string, Uint8Array> & { push: string },
		)
	}
}
