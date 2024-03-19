/**
 * @module
 * This module offers streaming methods for to and from base58 and Uint8Array.
 */

import { decodeBase58, encodeBase58 } from '@std/encoding/base58'

/**
 * Based off the @std/encoding module, offering a streaming alternative for `encodeBase58`
 */
export class EncodeBase58Stream extends TransformStream<Uint8Array, string> {
	constructor() {
		super({
			transform(chunk, controller) {
				controller.enqueue(encodeBase58(chunk))
			},
		})
	}
}

/**
 * Based off the @std/encoding module, offering a streaming alternative for `decodeBase58`
 */
export class DecodeBase58Stream extends TransformStream<string, Uint8Array> {
	constructor() {
		super({
			transform(chunk, controller) {
				controller.enqueue(decodeBase58(chunk))
			},
		})
	}
}
