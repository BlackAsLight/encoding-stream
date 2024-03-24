/**
 * @module
 * This module offers streaming methods for to and from hex and Uint8Array.
 */

import { encodeHex, decodeHex } from '@std/encoding/hex'

/**
 * Based off the @std/encoding module, offering a streaming alternative for `encodeHex`
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
 */
export class DecodeHexStream extends TransformStream<string, Uint8Array> {
	constructor() {
		super({
			transform(chunk, controller) {
				controller.enqueue(decodeHex(chunk))
			},
		})
	}
}
