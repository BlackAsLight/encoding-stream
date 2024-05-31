/**
 * @module
 * This module offers streaming methods for to and from hex and Uint8Array.
 */

import { decodeHex, encodeHex } from '@std/encoding/hex'

/**
 * Based off the @std/encoding module, offering a streaming alternative for `encodeHex`
 *
 * @example
 * ```ts
 * import { EncodeHexStream } from '@doctor/encoding-stream/hex'
 *
 * await (await Deno.open('./deno.json'))
 *   .readable
 *   .pipeThrough(new EncodeHexStream())
 *   .pipeThrough(new TextEncoderStream())
 *   .pipeTo((await Deno.create('./hex.txt')).writable)
 * ```
 */
export class EncodeHexStream extends TransformStream<Uint8Array, string> {
	constructor() {
		super({
			transform(chunk, controller) {
				controller.enqueue(encodeHex(chunk))
			},
		})
	}
}

/**
 * Based off the @std/encoding module, offering a streaming alternative for `decodeHex`
 *
 * @example
 * ```ts
 * import { DecodeHexStream } from '@doctor/encoding-stream/hex'
 *
 * await (await Deno.open('./hex.txt'))
 *   .readable
 *   .pipeThrough(new TextDecoderStream())
 *   .pipeThrough(new DecodeHexStream())
 *   .pipeTo((await Deno.create('./deno.json')).writable)
 * ```
 */
export class DecodeHexStream extends TransformStream<string, Uint8Array> {
	constructor() {
		super(
			{
				push: '',
				transform(chunk, controller) {
					const remainder = -(this.push.length + chunk.length) % 2
					controller.enqueue(
						decodeHex(this.push + chunk.slice(0, remainder || undefined)),
					)
					this.push = remainder ? chunk.slice(remainder) : ''
				},
				flush(controller) {
					if (this.push.length) controller.enqueue(decodeHex(this.push))
				},
			} as Transformer<string, Uint8Array> & { push: string },
		)
	}
}
