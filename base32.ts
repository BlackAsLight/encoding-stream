/**
 * @module
 * This module offers streaming methods for to and from base32 and Uint8Array.
 */

import { decodeBase32, encodeBase32 } from '@std/encoding/base32'

/**
 * Based off the @std/encoding module, offering a streaming alternative for `encodeBase32`
 */
export class EncodeBase32Stream extends TransformStream<Uint8Array, string> {
	constructor() {
		let push = new Uint8Array(0)
		super({
			transform(chunk, controller) {
				const concat = new Uint8Array(push.length + chunk.length)
				concat.set(push)
				concat.set(chunk, push.length)

				const remainder = -concat.length % 5
				controller.enqueue(encodeBase32(concat.slice(0, remainder || undefined)))
				push = remainder ? concat.slice(remainder) : new Uint8Array(0)
			},
			flush(controller) {
				controller.enqueue(encodeBase32(push))
			},
		})
	}
}

/**
 * Based off the @std/encoding module, offering a streaming alternative for `decodeBase32`
 */
export class DecodeBase32Stream extends TransformStream<string, Uint8Array> {
	constructor() {
		let push = ''
		super({
			transform(chunk, controller) {
				const remainder = -(push.length + chunk.length) % 8
				controller.enqueue(decodeBase32(push + chunk.slice(0, remainder || undefined)))
				push = remainder ? chunk.slice(remainder) : ''
			},
			flush(controller) {
				if (push.length) controller.enqueue(decodeBase32(push))
			},
		})
	}
}
