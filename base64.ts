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
		super({
			push: new Uint8Array(0),
			transform(chunk, controller) {
				const concat = new Uint8Array(this.push.length + chunk.length)
				concat.set(this.push)
				concat.set(chunk, this.push.length)

				const remainder = -concat.length % 3
				controller.enqueue(encodeBase64(concat.slice(0, remainder || undefined)))
				this.push = remainder ? concat.slice(remainder) : new Uint8Array(0)
			},
			flush(controller) {
				controller.enqueue(encodeBase64(this.push))
			},
		} as Transformer<Uint8Array, string> & { push: Uint8Array })
	}
}

/**
 * Based off the @std/encoding module, offering a streaming alternative for `decodeBase64`
 */
export class DecodeBase64Stream extends TransformStream<string, Uint8Array> {
	constructor() {
		super({
			transform(chunk, controller) {
				controller.enqueue(decodeBase64(chunk))
			},
		})
	}
}
