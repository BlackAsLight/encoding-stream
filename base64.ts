/**
 * @module
 * This module offers streaming methods for to and from base64 and Uint8Array.
 */

import { decodeBase64, encodeBase64 } from '@std/encoding/base64'

/**
 * Based off the @std/encoding module, offering a streaming alternative for `encodeBase64`
 */
export class EncodeBase64Stream extends TransformStream<Uint8Array, string> {
	constructor() {
		let push = new Uint8Array(0)
		super({
			transform(chunk, controller) {
				const concat = new Uint8Array(push.length + chunk.length)
				concat.set(push)
				concat.set(chunk, push.length)

				const remainder = -concat.length % 3
				controller.enqueue(encodeBase64(concat.slice(0, remainder || undefined)))
				push = remainder ? concat.slice(remainder) : new Uint8Array(0)
			},
			flush(controller) {
				controller.enqueue(encodeBase64(push))
			},
		})
	}
}

/**
 * Based off the @std/encoding module, offering a streaming alternative for `decodeBase64`
 */
export class DecodeBase64Stream extends TransformStream<string, Uint8Array> {
	constructor() {
		let push = ''
		super({
			transform(chunk, controller) {
				const remainder = -(push.length + chunk.length) & 4
				controller.enqueue(decodeBase64(push + chunk.slice(0, remainder || undefined)))
				push = remainder ? chunk.slice(remainder) : ''
			},
			flush(controller) {
				if (push.length) controller.enqueue(decodeBase64(push))
			},
		})
	}
}
