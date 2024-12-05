let wasm;

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

let WASM_VECTOR_LEN = 0;

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}
/**
 * Generate a new global key pair
 * @returns {GlobalKeyPair}
 */
export function makeGlobalKeys() {
    const ret = wasm.makeGlobalKeys();
    return GlobalKeyPair.__wrap(ret);
}

/**
 * Generate a subkey from a global secret key, a context, and an encryption secret
 * @param {GlobalSecretKey} global
 * @param {string} context
 * @param {EncryptionSecret} secret
 * @returns {SessionKeyPair}
 */
export function makeSessionKeys(global, context, secret) {
    _assertClass(global, GlobalSecretKey);
    const ptr0 = passStringToWasm0(context, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    _assertClass(secret, EncryptionSecret);
    const ret = wasm.makeSessionKeys(global.__wbg_ptr, ptr0, len0, secret.__wbg_ptr);
    return SessionKeyPair.__wrap(ret);
}

/**
 * Encrypt a pseudonym
 * @param {Pseudonym} message
 * @param {SessionPublicKey} public_key
 * @returns {EncryptedPseudonym}
 */
export function encryptPseudonym(message, public_key) {
    _assertClass(message, Pseudonym);
    _assertClass(public_key, SessionPublicKey);
    const ret = wasm.encryptData(message.__wbg_ptr, public_key.__wbg_ptr);
    return EncryptedPseudonym.__wrap(ret);
}

/**
 * Decrypt an encrypted pseudonym
 * @param {EncryptedPseudonym} encrypted
 * @param {SessionSecretKey} secret_key
 * @returns {Pseudonym}
 */
export function decryptPseudonym(encrypted, secret_key) {
    _assertClass(encrypted, EncryptedPseudonym);
    _assertClass(secret_key, SessionSecretKey);
    const ret = wasm.decryptPseudonym(encrypted.__wbg_ptr, secret_key.__wbg_ptr);
    return Pseudonym.__wrap(ret);
}

/**
 * Encrypt a data point
 * @param {DataPoint} message
 * @param {SessionPublicKey} public_key
 * @returns {EncryptedDataPoint}
 */
export function encryptData(message, public_key) {
    _assertClass(message, DataPoint);
    _assertClass(public_key, SessionPublicKey);
    const ret = wasm.encryptData(message.__wbg_ptr, public_key.__wbg_ptr);
    return EncryptedDataPoint.__wrap(ret);
}

/**
 * Decrypt an encrypted data point
 * @param {EncryptedDataPoint} encrypted
 * @param {SessionSecretKey} secret_key
 * @returns {DataPoint}
 */
export function decryptData(encrypted, secret_key) {
    _assertClass(encrypted, EncryptedDataPoint);
    _assertClass(secret_key, SessionSecretKey);
    const ret = wasm.decryptData(encrypted.__wbg_ptr, secret_key.__wbg_ptr);
    return DataPoint.__wrap(ret);
}

/**
 * @param {EncryptedPseudonym} encrypted
 * @param {SessionPublicKey} public_key
 * @returns {EncryptedPseudonym}
 */
export function rerandomizePseudonym(encrypted, public_key) {
    _assertClass(encrypted, EncryptedPseudonym);
    _assertClass(public_key, SessionPublicKey);
    const ret = wasm.rerandomizeData(encrypted.__wbg_ptr, public_key.__wbg_ptr);
    return EncryptedPseudonym.__wrap(ret);
}

/**
 * @param {EncryptedDataPoint} encrypted
 * @param {SessionPublicKey} public_key
 * @returns {EncryptedDataPoint}
 */
export function rerandomizeData(encrypted, public_key) {
    _assertClass(encrypted, EncryptedDataPoint);
    _assertClass(public_key, SessionPublicKey);
    const ret = wasm.rerandomizeData(encrypted.__wbg_ptr, public_key.__wbg_ptr);
    return EncryptedDataPoint.__wrap(ret);
}

/**
 * @param {EncryptedPseudonym} encrypted
 * @param {GlobalPublicKey} public_key
 * @returns {EncryptedPseudonym}
 */
export function rerandomizePseudonymGlobal(encrypted, public_key) {
    _assertClass(encrypted, EncryptedPseudonym);
    _assertClass(public_key, GlobalPublicKey);
    const ret = wasm.rerandomizeData(encrypted.__wbg_ptr, public_key.__wbg_ptr);
    return EncryptedPseudonym.__wrap(ret);
}

/**
 * @param {EncryptedDataPoint} encrypted
 * @param {GlobalPublicKey} public_key
 * @returns {EncryptedDataPoint}
 */
export function rerandomizeDataGlobal(encrypted, public_key) {
    _assertClass(encrypted, EncryptedDataPoint);
    _assertClass(public_key, GlobalPublicKey);
    const ret = wasm.rerandomizeData(encrypted.__wbg_ptr, public_key.__wbg_ptr);
    return EncryptedDataPoint.__wrap(ret);
}

/**
 * @param {EncryptedPseudonym} encrypted
 * @param {SessionPublicKey} public_key
 * @param {RerandomizeFactor} r
 * @returns {EncryptedPseudonym}
 */
export function rerandomizePseudonymKnown(encrypted, public_key, r) {
    _assertClass(encrypted, EncryptedPseudonym);
    _assertClass(public_key, SessionPublicKey);
    _assertClass(r, RerandomizeFactor);
    const ret = wasm.rerandomizeDataGlobalKnown(encrypted.__wbg_ptr, public_key.__wbg_ptr, r.__wbg_ptr);
    return EncryptedPseudonym.__wrap(ret);
}

/**
 * @param {EncryptedDataPoint} encrypted
 * @param {SessionPublicKey} public_key
 * @param {RerandomizeFactor} r
 * @returns {EncryptedDataPoint}
 */
export function rerandomizeDataKnown(encrypted, public_key, r) {
    _assertClass(encrypted, EncryptedDataPoint);
    _assertClass(public_key, SessionPublicKey);
    _assertClass(r, RerandomizeFactor);
    const ret = wasm.rerandomizeDataGlobalKnown(encrypted.__wbg_ptr, public_key.__wbg_ptr, r.__wbg_ptr);
    return EncryptedDataPoint.__wrap(ret);
}

/**
 * @param {EncryptedPseudonym} encrypted
 * @param {GlobalPublicKey} public_key
 * @param {RerandomizeFactor} r
 * @returns {EncryptedPseudonym}
 */
export function rerandomizePseudonymGlobalKnown(encrypted, public_key, r) {
    _assertClass(encrypted, EncryptedPseudonym);
    _assertClass(public_key, GlobalPublicKey);
    _assertClass(r, RerandomizeFactor);
    const ret = wasm.rerandomizeDataGlobalKnown(encrypted.__wbg_ptr, public_key.__wbg_ptr, r.__wbg_ptr);
    return EncryptedPseudonym.__wrap(ret);
}

/**
 * @param {EncryptedDataPoint} encrypted
 * @param {GlobalPublicKey} public_key
 * @param {RerandomizeFactor} r
 * @returns {EncryptedDataPoint}
 */
export function rerandomizeDataGlobalKnown(encrypted, public_key, r) {
    _assertClass(encrypted, EncryptedDataPoint);
    _assertClass(public_key, GlobalPublicKey);
    _assertClass(r, RerandomizeFactor);
    const ret = wasm.rerandomizeDataGlobalKnown(encrypted.__wbg_ptr, public_key.__wbg_ptr, r.__wbg_ptr);
    return EncryptedDataPoint.__wrap(ret);
}

/**
 * Pseudonymize an encrypted pseudonym, from one context to another context
 * @param {EncryptedPseudonym} encrypted
 * @param {PseudonymizationInfo} pseudo_info
 * @returns {EncryptedPseudonym}
 */
export function pseudonymize(encrypted, pseudo_info) {
    _assertClass(encrypted, EncryptedPseudonym);
    _assertClass(pseudo_info, PseudonymizationInfo);
    const ret = wasm.pseudonymize(encrypted.__wbg_ptr, pseudo_info.__wbg_ptr);
    return EncryptedPseudonym.__wrap(ret);
}

/**
 * Rekey an encrypted data point, encrypted with one session key, to be decrypted by another session key
 * @param {EncryptedDataPoint} encrypted
 * @param {RekeyInfo} rekey_info
 * @returns {EncryptedDataPoint}
 */
export function rekeyData(encrypted, rekey_info) {
    _assertClass(encrypted, EncryptedDataPoint);
    _assertClass(rekey_info, RekeyInfo);
    const ret = wasm.rekeyData(encrypted.__wbg_ptr, rekey_info.__wbg_ptr);
    return EncryptedDataPoint.__wrap(ret);
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_0.set(idx, obj);
    return idx;
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    const mem = getDataViewMemory0();
    for (let i = 0; i < array.length; i++) {
        mem.setUint32(ptr + 4 * i, addToExternrefTable0(array[i]), true);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_export_0.get(mem.getUint32(i, true)));
    }
    wasm.__externref_drop_slice(ptr, len);
    return result;
}
/**
 * @param {(EncryptedPseudonym)[]} encrypted
 * @param {PseudonymizationInfo} pseudo_info
 * @returns {(EncryptedPseudonym)[]}
 */
export function pseudonymizeBatch(encrypted, pseudo_info) {
    const ptr0 = passArrayJsValueToWasm0(encrypted, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    _assertClass(pseudo_info, PseudonymizationInfo);
    const ret = wasm.pseudonymizeBatch(ptr0, len0, pseudo_info.__wbg_ptr);
    var v2 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v2;
}

/**
 * @param {(EncryptedDataPoint)[]} encrypted
 * @param {RekeyInfo} rekey_info
 * @returns {(EncryptedDataPoint)[]}
 */
export function rekeyBatch(encrypted, rekey_info) {
    const ptr0 = passArrayJsValueToWasm0(encrypted, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    _assertClass(rekey_info, RekeyInfo);
    const ret = wasm.rekeyBatch(ptr0, len0, rekey_info.__wbg_ptr);
    var v2 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v2;
}

/**
 * @param {GlobalSecretKey} global_secret_key
 * @param {(BlindingFactor)[]} blinding_factors
 * @returns {BlindedGlobalSecretKey}
 */
export function makeBlindedGlobalSecretKey(global_secret_key, blinding_factors) {
    _assertClass(global_secret_key, GlobalSecretKey);
    const ptr0 = passArrayJsValueToWasm0(blinding_factors, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.makeBlindedGlobalSecretKey(global_secret_key.__wbg_ptr, ptr0, len0);
    return BlindedGlobalSecretKey.__wrap(ret);
}

/**
 * @param {GroupElement} gm
 * @param {GroupElement} gy
 * @returns {ElGamal}
 */
export function encrypt(gm, gy) {
    _assertClass(gm, GroupElement);
    _assertClass(gy, GroupElement);
    const ret = wasm.encrypt(gm.__wbg_ptr, gy.__wbg_ptr);
    return ElGamal.__wrap(ret);
}

/**
 * @param {ElGamal} encrypted
 * @param {ScalarNonZero} y
 * @returns {GroupElement}
 */
export function decrypt(encrypted, y) {
    _assertClass(encrypted, ElGamal);
    _assertClass(y, ScalarNonZero);
    const ret = wasm.decrypt(encrypted.__wbg_ptr, y.__wbg_ptr);
    return GroupElement.__wrap(ret);
}

/**
 * @param {ElGamal} v
 * @param {GroupElement} public_key
 * @param {ScalarNonZero} r
 * @returns {ElGamal}
 */
export function rerandomize(v, public_key, r) {
    _assertClass(v, ElGamal);
    _assertClass(public_key, GroupElement);
    _assertClass(r, ScalarNonZero);
    const ret = wasm.rerandomize(v.__wbg_ptr, public_key.__wbg_ptr, r.__wbg_ptr);
    return ElGamal.__wrap(ret);
}

/**
 * @param {ElGamal} v
 * @param {ScalarNonZero} k
 * @returns {ElGamal}
 */
export function rekey(v, k) {
    _assertClass(v, ElGamal);
    _assertClass(k, ScalarNonZero);
    const ret = wasm.rekey(v.__wbg_ptr, k.__wbg_ptr);
    return ElGamal.__wrap(ret);
}

/**
 * @param {ElGamal} v
 * @param {ScalarNonZero} s
 * @returns {ElGamal}
 */
export function reshuffle(v, s) {
    _assertClass(v, ElGamal);
    _assertClass(s, ScalarNonZero);
    const ret = wasm.reshuffle(v.__wbg_ptr, s.__wbg_ptr);
    return ElGamal.__wrap(ret);
}

/**
 * @param {ElGamal} v
 * @param {ScalarNonZero} k_from
 * @param {ScalarNonZero} k_to
 * @returns {ElGamal}
 */
export function rekey2(v, k_from, k_to) {
    _assertClass(v, ElGamal);
    _assertClass(k_from, ScalarNonZero);
    _assertClass(k_to, ScalarNonZero);
    const ret = wasm.rekey2(v.__wbg_ptr, k_from.__wbg_ptr, k_to.__wbg_ptr);
    return ElGamal.__wrap(ret);
}

/**
 * @param {ElGamal} v
 * @param {ScalarNonZero} n_from
 * @param {ScalarNonZero} n_to
 * @returns {ElGamal}
 */
export function reshuffle2(v, n_from, n_to) {
    _assertClass(v, ElGamal);
    _assertClass(n_from, ScalarNonZero);
    _assertClass(n_to, ScalarNonZero);
    const ret = wasm.reshuffle2(v.__wbg_ptr, n_from.__wbg_ptr, n_to.__wbg_ptr);
    return ElGamal.__wrap(ret);
}

/**
 * @param {ElGamal} v
 * @param {ScalarNonZero} s
 * @param {ScalarNonZero} k
 * @returns {ElGamal}
 */
export function rsk(v, s, k) {
    _assertClass(v, ElGamal);
    _assertClass(s, ScalarNonZero);
    _assertClass(k, ScalarNonZero);
    const ret = wasm.rsk(v.__wbg_ptr, s.__wbg_ptr, k.__wbg_ptr);
    return ElGamal.__wrap(ret);
}

/**
 * @param {ElGamal} v
 * @param {ScalarNonZero} s_from
 * @param {ScalarNonZero} s_to
 * @param {ScalarNonZero} k_from
 * @param {ScalarNonZero} k_to
 * @returns {ElGamal}
 */
export function rsk2(v, s_from, s_to, k_from, k_to) {
    _assertClass(v, ElGamal);
    _assertClass(s_from, ScalarNonZero);
    _assertClass(s_to, ScalarNonZero);
    _assertClass(k_from, ScalarNonZero);
    _assertClass(k_to, ScalarNonZero);
    const ret = wasm.rsk2(v.__wbg_ptr, s_from.__wbg_ptr, s_to.__wbg_ptr, k_from.__wbg_ptr, k_to.__wbg_ptr);
    return ElGamal.__wrap(ret);
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

const BlindedGlobalSecretKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_blindedglobalsecretkey_free(ptr >>> 0, 1));

export class BlindedGlobalSecretKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(BlindedGlobalSecretKey.prototype);
        obj.__wbg_ptr = ptr;
        BlindedGlobalSecretKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BlindedGlobalSecretKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_blindedglobalsecretkey_free(ptr, 0);
    }
    /**
     * @param {ScalarNonZero} x
     */
    constructor(x) {
        _assertClass(x, ScalarNonZero);
        var ptr0 = x.__destroy_into_raw();
        const ret = wasm.blindedglobalsecretkey_new(ptr0);
        this.__wbg_ptr = ret >>> 0;
        BlindedGlobalSecretKeyFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Uint8Array}
     */
    encode() {
        const ret = wasm.blindedglobalsecretkey_encode(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {BlindedGlobalSecretKey | undefined}
     */
    static decode(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.blindedglobalsecretkey_decode(ptr0, len0);
        return ret === 0 ? undefined : BlindedGlobalSecretKey.__wrap(ret);
    }
    /**
     * @returns {string}
     */
    toHex() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.blindedglobalsecretkey_toHex(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} hex
     * @returns {BlindedGlobalSecretKey | undefined}
     */
    static fromHex(hex) {
        const ptr0 = passStringToWasm0(hex, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.blindedglobalsecretkey_fromHex(ptr0, len0);
        return ret === 0 ? undefined : BlindedGlobalSecretKey.__wrap(ret);
    }
}

const BlindingFactorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_blindingfactor_free(ptr >>> 0, 1));

export class BlindingFactor {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(BlindingFactor.prototype);
        obj.__wbg_ptr = ptr;
        BlindingFactorFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    static __unwrap(jsValue) {
        if (!(jsValue instanceof BlindingFactor)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BlindingFactorFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_blindingfactor_free(ptr, 0);
    }
    /**
     * @param {ScalarNonZero} x
     */
    constructor(x) {
        _assertClass(x, ScalarNonZero);
        var ptr0 = x.__destroy_into_raw();
        const ret = wasm.blindedglobalsecretkey_new(ptr0);
        this.__wbg_ptr = ret >>> 0;
        BlindingFactorFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {BlindingFactor}
     */
    static random() {
        const ret = wasm.blindingfactor_random();
        return BlindingFactor.__wrap(ret);
    }
    /**
     * @returns {BlindingFactor}
     */
    clone() {
        const ret = wasm.blindingfactor_clone(this.__wbg_ptr);
        return BlindingFactor.__wrap(ret);
    }
    /**
     * @returns {Uint8Array}
     */
    encode() {
        const ret = wasm.blindingfactor_encode(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {BlindingFactor | undefined}
     */
    static decode(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.blindedglobalsecretkey_decode(ptr0, len0);
        return ret === 0 ? undefined : BlindingFactor.__wrap(ret);
    }
    /**
     * @returns {string}
     */
    toHex() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.blindingfactor_toHex(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} hex
     * @returns {BlindingFactor | undefined}
     */
    static fromHex(hex) {
        const ptr0 = passStringToWasm0(hex, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.blindedglobalsecretkey_fromHex(ptr0, len0);
        return ret === 0 ? undefined : BlindingFactor.__wrap(ret);
    }
}

const DataPointFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_datapoint_free(ptr >>> 0, 1));

export class DataPoint {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DataPoint.prototype);
        obj.__wbg_ptr = ptr;
        DataPointFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DataPointFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_datapoint_free(ptr, 0);
    }
    /**
     * @param {GroupElement} x
     */
    constructor(x) {
        _assertClass(x, GroupElement);
        var ptr0 = x.__destroy_into_raw();
        const ret = wasm.datapoint_from_point(ptr0);
        this.__wbg_ptr = ret >>> 0;
        DataPointFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {GroupElement}
     */
    toPoint() {
        const ret = wasm.datapoint_toPoint(this.__wbg_ptr);
        return GroupElement.__wrap(ret);
    }
    /**
     * @returns {DataPoint}
     */
    static random() {
        const ret = wasm.datapoint_random();
        return DataPoint.__wrap(ret);
    }
    /**
     * @returns {Uint8Array}
     */
    encode() {
        const ret = wasm.datapoint_encode(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * @returns {string}
     */
    toHex() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.datapoint_toHex(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {DataPoint | undefined}
     */
    static decode(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.datapoint_decode(ptr0, len0);
        return ret === 0 ? undefined : DataPoint.__wrap(ret);
    }
    /**
     * @param {string} hex
     * @returns {DataPoint | undefined}
     */
    static fromHex(hex) {
        const ptr0 = passStringToWasm0(hex, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.datapoint_fromHex(ptr0, len0);
        return ret === 0 ? undefined : DataPoint.__wrap(ret);
    }
    /**
     * @param {Uint8Array} v
     * @returns {DataPoint}
     */
    static fromHash(v) {
        const ptr0 = passArray8ToWasm0(v, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.datapoint_fromHash(ptr0, len0);
        return DataPoint.__wrap(ret);
    }
    /**
     * @param {Uint8Array} data
     * @returns {DataPoint}
     */
    static fromBytes(data) {
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.datapoint_fromBytes(ptr0, len0);
        return DataPoint.__wrap(ret);
    }
    /**
     * @returns {Uint8Array | undefined}
     */
    toBytes() {
        const ret = wasm.datapoint_toBytes(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
}

const ElGamalFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_elgamal_free(ptr >>> 0, 1));

export class ElGamal {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ElGamal.prototype);
        obj.__wbg_ptr = ptr;
        ElGamalFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ElGamalFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_elgamal_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    encode() {
        const ret = wasm.elgamal_encode(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * @param {Uint8Array} v
     * @returns {ElGamal | undefined}
     */
    static decode(v) {
        const ptr0 = passArray8ToWasm0(v, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.elgamal_decode(ptr0, len0);
        return ret === 0 ? undefined : ElGamal.__wrap(ret);
    }
    /**
     * @returns {string}
     */
    toBase64() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.elgamal_toBase64(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} s
     * @returns {ElGamal | undefined}
     */
    static fromBase64(s) {
        const ptr0 = passStringToWasm0(s, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.elgamal_fromBase64(ptr0, len0);
        return ret === 0 ? undefined : ElGamal.__wrap(ret);
    }
}

const EncryptedDataPointFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_encrypteddatapoint_free(ptr >>> 0, 1));

export class EncryptedDataPoint {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(EncryptedDataPoint.prototype);
        obj.__wbg_ptr = ptr;
        EncryptedDataPointFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    static __unwrap(jsValue) {
        if (!(jsValue instanceof EncryptedDataPoint)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        EncryptedDataPointFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_encrypteddatapoint_free(ptr, 0);
    }
    /**
     * @param {ElGamal} x
     */
    constructor(x) {
        _assertClass(x, ElGamal);
        var ptr0 = x.__destroy_into_raw();
        const ret = wasm.encrypteddatapoint_new(ptr0);
        this.__wbg_ptr = ret >>> 0;
        EncryptedDataPointFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Uint8Array}
     */
    encode() {
        const ret = wasm.encrypteddatapoint_encode(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * @param {Uint8Array} v
     * @returns {EncryptedDataPoint | undefined}
     */
    static decode(v) {
        const ptr0 = passArray8ToWasm0(v, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.encrypteddatapoint_decode(ptr0, len0);
        return ret === 0 ? undefined : EncryptedDataPoint.__wrap(ret);
    }
    /**
     * @returns {string}
     */
    toBase64() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.encrypteddatapoint_toBase64(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} s
     * @returns {EncryptedDataPoint | undefined}
     */
    static fromBase64(s) {
        const ptr0 = passStringToWasm0(s, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.encrypteddatapoint_fromBase64(ptr0, len0);
        return ret === 0 ? undefined : EncryptedDataPoint.__wrap(ret);
    }
}

const EncryptedPseudonymFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_encryptedpseudonym_free(ptr >>> 0, 1));

export class EncryptedPseudonym {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(EncryptedPseudonym.prototype);
        obj.__wbg_ptr = ptr;
        EncryptedPseudonymFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    static __unwrap(jsValue) {
        if (!(jsValue instanceof EncryptedPseudonym)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        EncryptedPseudonymFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_encryptedpseudonym_free(ptr, 0);
    }
    /**
     * @param {ElGamal} x
     */
    constructor(x) {
        _assertClass(x, ElGamal);
        var ptr0 = x.__destroy_into_raw();
        const ret = wasm.encrypteddatapoint_new(ptr0);
        this.__wbg_ptr = ret >>> 0;
        EncryptedPseudonymFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Uint8Array}
     */
    encode() {
        const ret = wasm.encryptedpseudonym_encode(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * @param {Uint8Array} v
     * @returns {EncryptedPseudonym | undefined}
     */
    static decode(v) {
        const ptr0 = passArray8ToWasm0(v, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.encrypteddatapoint_decode(ptr0, len0);
        return ret === 0 ? undefined : EncryptedPseudonym.__wrap(ret);
    }
    /**
     * @returns {string}
     */
    toBase64() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.encryptedpseudonym_toBase64(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} s
     * @returns {EncryptedPseudonym | undefined}
     */
    static fromBase64(s) {
        const ptr0 = passStringToWasm0(s, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.encrypteddatapoint_fromBase64(ptr0, len0);
        return ret === 0 ? undefined : EncryptedPseudonym.__wrap(ret);
    }
}

const EncryptionSecretFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_encryptionsecret_free(ptr >>> 0, 1));

export class EncryptionSecret {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        EncryptionSecretFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_encryptionsecret_free(ptr, 0);
    }
    /**
     * @param {Uint8Array} data
     */
    constructor(data) {
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.encryptionsecret_from(ptr0, len0);
        this.__wbg_ptr = ret >>> 0;
        EncryptionSecretFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}

const GlobalKeyPairFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_globalkeypair_free(ptr >>> 0, 1));

export class GlobalKeyPair {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(GlobalKeyPair.prototype);
        obj.__wbg_ptr = ptr;
        GlobalKeyPairFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GlobalKeyPairFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_globalkeypair_free(ptr, 0);
    }
    /**
     * @returns {GlobalPublicKey}
     */
    get public() {
        const ret = wasm.__wbg_get_globalkeypair_public(this.__wbg_ptr);
        return GlobalPublicKey.__wrap(ret);
    }
    /**
     * @param {GlobalPublicKey} arg0
     */
    set public(arg0) {
        _assertClass(arg0, GlobalPublicKey);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_globalkeypair_public(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {GlobalSecretKey}
     */
    get secret() {
        const ret = wasm.__wbg_get_globalkeypair_secret(this.__wbg_ptr);
        return GlobalSecretKey.__wrap(ret);
    }
    /**
     * @param {GlobalSecretKey} arg0
     */
    set secret(arg0) {
        _assertClass(arg0, GlobalSecretKey);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_globalkeypair_secret(this.__wbg_ptr, ptr0);
    }
}

const GlobalPublicKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_globalpublickey_free(ptr >>> 0, 1));

export class GlobalPublicKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(GlobalPublicKey.prototype);
        obj.__wbg_ptr = ptr;
        GlobalPublicKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GlobalPublicKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_globalpublickey_free(ptr, 0);
    }
    /**
     * @returns {GroupElement}
     */
    get 0() {
        const ret = wasm.__wbg_get_globalpublickey_0(this.__wbg_ptr);
        return GroupElement.__wrap(ret);
    }
    /**
     * @param {GroupElement} arg0
     */
    set 0(arg0) {
        _assertClass(arg0, GroupElement);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_globalpublickey_0(this.__wbg_ptr, ptr0);
    }
}

const GlobalSecretKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_globalsecretkey_free(ptr >>> 0, 1));

export class GlobalSecretKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(GlobalSecretKey.prototype);
        obj.__wbg_ptr = ptr;
        GlobalSecretKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GlobalSecretKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_globalsecretkey_free(ptr, 0);
    }
    /**
     * @returns {ScalarNonZero}
     */
    get 0() {
        const ret = wasm.__wbg_get_globalsecretkey_0(this.__wbg_ptr);
        return ScalarNonZero.__wrap(ret);
    }
    /**
     * @param {ScalarNonZero} arg0
     */
    set 0(arg0) {
        _assertClass(arg0, ScalarNonZero);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_globalsecretkey_0(this.__wbg_ptr, ptr0);
    }
}

const GroupElementFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_groupelement_free(ptr >>> 0, 1));

export class GroupElement {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(GroupElement.prototype);
        obj.__wbg_ptr = ptr;
        GroupElementFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GroupElementFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_groupelement_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    encode() {
        const ret = wasm.groupelement_encode(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {GroupElement | undefined}
     */
    static decode(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.groupelement_decode(ptr0, len0);
        return ret === 0 ? undefined : GroupElement.__wrap(ret);
    }
    /**
     * @returns {GroupElement}
     */
    static random() {
        const ret = wasm.groupelement_random();
        return GroupElement.__wrap(ret);
    }
    /**
     * @param {Uint8Array} v
     * @returns {GroupElement}
     */
    static fromHash(v) {
        const ptr0 = passArray8ToWasm0(v, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.groupelement_fromHash(ptr0, len0);
        return GroupElement.__wrap(ret);
    }
    /**
     * @param {string} hex
     * @returns {GroupElement | undefined}
     */
    static fromHex(hex) {
        const ptr0 = passStringToWasm0(hex, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.groupelement_fromHex(ptr0, len0);
        return ret === 0 ? undefined : GroupElement.__wrap(ret);
    }
    /**
     * @returns {string}
     */
    toHex() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.groupelement_toHex(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {GroupElement}
     */
    static identity() {
        const ret = wasm.groupelement_identity();
        return GroupElement.__wrap(ret);
    }
    /**
     * @returns {GroupElement}
     */
    static G() {
        const ret = wasm.groupelement_G();
        return GroupElement.__wrap(ret);
    }
    /**
     * @returns {GroupElement}
     */
    static generator() {
        const ret = wasm.groupelement_G();
        return GroupElement.__wrap(ret);
    }
    /**
     * @param {GroupElement} other
     * @returns {GroupElement}
     */
    add(other) {
        _assertClass(other, GroupElement);
        const ret = wasm.groupelement_add(this.__wbg_ptr, other.__wbg_ptr);
        return GroupElement.__wrap(ret);
    }
    /**
     * @param {GroupElement} other
     * @returns {GroupElement}
     */
    sub(other) {
        _assertClass(other, GroupElement);
        const ret = wasm.groupelement_sub(this.__wbg_ptr, other.__wbg_ptr);
        return GroupElement.__wrap(ret);
    }
    /**
     * @param {ScalarNonZero} other
     * @returns {GroupElement}
     */
    mul(other) {
        _assertClass(other, ScalarNonZero);
        const ret = wasm.groupelement_mul(this.__wbg_ptr, other.__wbg_ptr);
        return GroupElement.__wrap(ret);
    }
}

const OfflinePEPClientFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_offlinepepclient_free(ptr >>> 0, 1));

export class OfflinePEPClient {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        OfflinePEPClientFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_offlinepepclient_free(ptr, 0);
    }
    /**
     * @param {GlobalPublicKey} global_public_key
     */
    constructor(global_public_key) {
        _assertClass(global_public_key, GlobalPublicKey);
        var ptr0 = global_public_key.__destroy_into_raw();
        const ret = wasm.offlinepepclient_new(ptr0);
        this.__wbg_ptr = ret >>> 0;
        OfflinePEPClientFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {DataPoint} message
     * @returns {EncryptedDataPoint}
     */
    encryptData(message) {
        _assertClass(message, DataPoint);
        const ret = wasm.offlinepepclient_encryptData(this.__wbg_ptr, message.__wbg_ptr);
        return EncryptedDataPoint.__wrap(ret);
    }
    /**
     * @param {Pseudonym} message
     * @returns {EncryptedPseudonym}
     */
    encryptPseudonym(message) {
        _assertClass(message, Pseudonym);
        const ret = wasm.offlinepepclient_encryptData(this.__wbg_ptr, message.__wbg_ptr);
        return EncryptedPseudonym.__wrap(ret);
    }
}

const PEPClientFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_pepclient_free(ptr >>> 0, 1));

export class PEPClient {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PEPClientFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_pepclient_free(ptr, 0);
    }
    /**
     * @param {BlindedGlobalSecretKey} blinded_global_private_key
     * @param {(SessionKeyShare)[]} session_key_shares
     */
    constructor(blinded_global_private_key, session_key_shares) {
        _assertClass(blinded_global_private_key, BlindedGlobalSecretKey);
        const ptr0 = passArrayJsValueToWasm0(session_key_shares, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.pepclient_new(blinded_global_private_key.__wbg_ptr, ptr0, len0);
        this.__wbg_ptr = ret >>> 0;
        PEPClientFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {EncryptedPseudonym} encrypted
     * @returns {Pseudonym}
     */
    decryptPseudonym(encrypted) {
        _assertClass(encrypted, EncryptedPseudonym);
        const ret = wasm.pepclient_decryptData(this.__wbg_ptr, encrypted.__wbg_ptr);
        return Pseudonym.__wrap(ret);
    }
    /**
     * @param {EncryptedDataPoint} encrypted
     * @returns {DataPoint}
     */
    decryptData(encrypted) {
        _assertClass(encrypted, EncryptedDataPoint);
        const ret = wasm.pepclient_decryptData(this.__wbg_ptr, encrypted.__wbg_ptr);
        return DataPoint.__wrap(ret);
    }
    /**
     * @param {DataPoint} message
     * @returns {EncryptedDataPoint}
     */
    encryptData(message) {
        _assertClass(message, DataPoint);
        const ret = wasm.pepclient_encryptData(this.__wbg_ptr, message.__wbg_ptr);
        return EncryptedDataPoint.__wrap(ret);
    }
    /**
     * @param {Pseudonym} message
     * @returns {EncryptedPseudonym}
     */
    encryptPseudonym(message) {
        _assertClass(message, Pseudonym);
        const ret = wasm.pepclient_encryptData(this.__wbg_ptr, message.__wbg_ptr);
        return EncryptedPseudonym.__wrap(ret);
    }
}

const PEPSystemFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_pepsystem_free(ptr >>> 0, 1));

export class PEPSystem {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PEPSystemFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_pepsystem_free(ptr, 0);
    }
    /**
     * @param {string} pseudonymisation_secret
     * @param {string} rekeying_secret
     * @param {BlindingFactor} blinding_factor
     */
    constructor(pseudonymisation_secret, rekeying_secret, blinding_factor) {
        const ptr0 = passStringToWasm0(pseudonymisation_secret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(rekeying_secret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        _assertClass(blinding_factor, BlindingFactor);
        const ret = wasm.pepsystem_new(ptr0, len0, ptr1, len1, blinding_factor.__wbg_ptr);
        this.__wbg_ptr = ret >>> 0;
        PEPSystemFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {string} context
     * @returns {SessionKeyShare}
     */
    sessionKeyShare(context) {
        const ptr0 = passStringToWasm0(context, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.pepsystem_sessionKeyShare(this.__wbg_ptr, ptr0, len0);
        return SessionKeyShare.__wrap(ret);
    }
    /**
     * @param {string} from_enc
     * @param {string} to_enc
     * @returns {RekeyInfo}
     */
    rekeyInfo(from_enc, to_enc) {
        const ptr0 = passStringToWasm0(from_enc, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(to_enc, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.pepsystem_rekeyInfo(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return RekeyInfo.__wrap(ret);
    }
    /**
     * @param {string} from_pseudo
     * @param {string} to_pseudo
     * @param {string} from_enc
     * @param {string} to_enc
     * @returns {PseudonymizationInfo}
     */
    pseudonymizationInfo(from_pseudo, to_pseudo, from_enc, to_enc) {
        const ptr0 = passStringToWasm0(from_pseudo, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(to_pseudo, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(from_enc, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ptr3 = passStringToWasm0(to_enc, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len3 = WASM_VECTOR_LEN;
        const ret = wasm.pepsystem_pseudonymizationInfo(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3);
        return PseudonymizationInfo.__wrap(ret);
    }
    /**
     * @param {EncryptedDataPoint} encrypted
     * @param {RekeyInfo} rekey_info
     * @returns {EncryptedDataPoint}
     */
    rekey(encrypted, rekey_info) {
        _assertClass(encrypted, EncryptedDataPoint);
        _assertClass(rekey_info, RekeyInfo);
        const ret = wasm.pepsystem_rekey(this.__wbg_ptr, encrypted.__wbg_ptr, rekey_info.__wbg_ptr);
        return EncryptedDataPoint.__wrap(ret);
    }
    /**
     * @param {EncryptedPseudonym} encrypted
     * @param {PseudonymizationInfo} pseudo_info
     * @returns {EncryptedPseudonym}
     */
    pseudonymize(encrypted, pseudo_info) {
        _assertClass(encrypted, EncryptedPseudonym);
        _assertClass(pseudo_info, PseudonymizationInfo);
        const ret = wasm.pepsystem_pseudonymize(this.__wbg_ptr, encrypted.__wbg_ptr, pseudo_info.__wbg_ptr);
        return EncryptedPseudonym.__wrap(ret);
    }
}

const PseudonymFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_pseudonym_free(ptr >>> 0, 1));

export class Pseudonym {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Pseudonym.prototype);
        obj.__wbg_ptr = ptr;
        PseudonymFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PseudonymFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_pseudonym_free(ptr, 0);
    }
    /**
     * @param {GroupElement} x
     */
    constructor(x) {
        _assertClass(x, GroupElement);
        var ptr0 = x.__destroy_into_raw();
        const ret = wasm.datapoint_from_point(ptr0);
        this.__wbg_ptr = ret >>> 0;
        PseudonymFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {GroupElement}
     */
    toPoint() {
        const ret = wasm.datapoint_toPoint(this.__wbg_ptr);
        return GroupElement.__wrap(ret);
    }
    /**
     * @returns {Pseudonym}
     */
    static random() {
        const ret = wasm.datapoint_random();
        return Pseudonym.__wrap(ret);
    }
    /**
     * @returns {Uint8Array}
     */
    encode() {
        const ret = wasm.pseudonym_encode(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * @returns {string}
     */
    toHex() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.pseudonym_toHex(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {Pseudonym | undefined}
     */
    static decode(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.datapoint_decode(ptr0, len0);
        return ret === 0 ? undefined : Pseudonym.__wrap(ret);
    }
    /**
     * @param {string} hex
     * @returns {Pseudonym | undefined}
     */
    static fromHex(hex) {
        const ptr0 = passStringToWasm0(hex, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.datapoint_fromHex(ptr0, len0);
        return ret === 0 ? undefined : Pseudonym.__wrap(ret);
    }
    /**
     * @param {Uint8Array} v
     * @returns {Pseudonym}
     */
    static fromHash(v) {
        const ptr0 = passArray8ToWasm0(v, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.pseudonym_fromHash(ptr0, len0);
        return Pseudonym.__wrap(ret);
    }
    /**
     * @param {Uint8Array} data
     * @returns {Pseudonym}
     */
    static fromBytes(data) {
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.pseudonym_fromBytes(ptr0, len0);
        return Pseudonym.__wrap(ret);
    }
    /**
     * @returns {Uint8Array | undefined}
     */
    toBytes() {
        const ret = wasm.pseudonym_toBytes(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
}

const PseudonymizationInfoFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_pseudonymizationinfo_free(ptr >>> 0, 1));

export class PseudonymizationInfo {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PseudonymizationInfo.prototype);
        obj.__wbg_ptr = ptr;
        PseudonymizationInfoFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PseudonymizationInfoFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_pseudonymizationinfo_free(ptr, 0);
    }
    /**
     * @returns {RSKFactors}
     */
    get 0() {
        const ret = wasm.__wbg_get_pseudonymizationinfo_0(this.__wbg_ptr);
        return RSKFactors.__wrap(ret);
    }
    /**
     * @param {RSKFactors} arg0
     */
    set 0(arg0) {
        _assertClass(arg0, RSKFactors);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_pseudonymizationinfo_0(this.__wbg_ptr, ptr0);
    }
    /**
     * @param {string} from_pseudo_context
     * @param {string} to_pseudo_context
     * @param {string} from_enc_context
     * @param {string} to_enc_context
     * @param {PseudonymizationSecret} pseudonymization_secret
     * @param {EncryptionSecret} encryption_secret
     */
    constructor(from_pseudo_context, to_pseudo_context, from_enc_context, to_enc_context, pseudonymization_secret, encryption_secret) {
        const ptr0 = passStringToWasm0(from_pseudo_context, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(to_pseudo_context, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(from_enc_context, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ptr3 = passStringToWasm0(to_enc_context, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len3 = WASM_VECTOR_LEN;
        _assertClass(pseudonymization_secret, PseudonymizationSecret);
        _assertClass(encryption_secret, EncryptionSecret);
        const ret = wasm.pseudonymizationinfo_new(ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, pseudonymization_secret.__wbg_ptr, encryption_secret.__wbg_ptr);
        this.__wbg_ptr = ret >>> 0;
        PseudonymizationInfoFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {PseudonymizationInfo}
     */
    rev() {
        const ret = wasm.pseudonymizationinfo_rev(this.__wbg_ptr);
        return PseudonymizationInfo.__wrap(ret);
    }
}

const PseudonymizationSecretFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_pseudonymizationsecret_free(ptr >>> 0, 1));

export class PseudonymizationSecret {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PseudonymizationSecretFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_pseudonymizationsecret_free(ptr, 0);
    }
    /**
     * @param {Uint8Array} data
     */
    constructor(data) {
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.encryptionsecret_from(ptr0, len0);
        this.__wbg_ptr = ret >>> 0;
        PseudonymizationSecretFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}

const RSKFactorsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_rskfactors_free(ptr >>> 0, 1));

export class RSKFactors {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RSKFactors.prototype);
        obj.__wbg_ptr = ptr;
        RSKFactorsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RSKFactorsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_rskfactors_free(ptr, 0);
    }
    /**
     * @returns {ReshuffleFactor}
     */
    get s() {
        const ret = wasm.__wbg_get_rekeyinfo_0(this.__wbg_ptr);
        return ReshuffleFactor.__wrap(ret);
    }
    /**
     * @param {ReshuffleFactor} arg0
     */
    set s(arg0) {
        _assertClass(arg0, ReshuffleFactor);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_rekeyinfo_0(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {RekeyFactor}
     */
    get k() {
        const ret = wasm.__wbg_get_rskfactors_k(this.__wbg_ptr);
        return RekeyFactor.__wrap(ret);
    }
    /**
     * @param {RekeyFactor} arg0
     */
    set k(arg0) {
        _assertClass(arg0, RekeyFactor);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_rskfactors_k(this.__wbg_ptr, ptr0);
    }
}

const RekeyFactorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_rekeyfactor_free(ptr >>> 0, 1));

export class RekeyFactor {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RekeyFactor.prototype);
        obj.__wbg_ptr = ptr;
        RekeyFactorFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RekeyFactorFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_rekeyfactor_free(ptr, 0);
    }
}

const RekeyInfoFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_rekeyinfo_free(ptr >>> 0, 1));

export class RekeyInfo {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RekeyInfo.prototype);
        obj.__wbg_ptr = ptr;
        RekeyInfoFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RekeyInfoFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_rekeyinfo_free(ptr, 0);
    }
    /**
     * @returns {RekeyFactor}
     */
    get 0() {
        const ret = wasm.__wbg_get_rekeyinfo_0(this.__wbg_ptr);
        return RekeyFactor.__wrap(ret);
    }
    /**
     * @param {RekeyFactor} arg0
     */
    set 0(arg0) {
        _assertClass(arg0, RekeyFactor);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_rekeyinfo_0(this.__wbg_ptr, ptr0);
    }
    /**
     * @param {string} from_enc_context
     * @param {string} to_enc_context
     * @param {EncryptionSecret} encryption_secret
     */
    constructor(from_enc_context, to_enc_context, encryption_secret) {
        const ptr0 = passStringToWasm0(from_enc_context, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(to_enc_context, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        _assertClass(encryption_secret, EncryptionSecret);
        const ret = wasm.rekeyinfo_new(ptr0, len0, ptr1, len1, encryption_secret.__wbg_ptr);
        this.__wbg_ptr = ret >>> 0;
        RekeyInfoFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {RekeyInfo}
     */
    rev() {
        const ret = wasm.rekeyinfo_rev(this.__wbg_ptr);
        return RekeyInfo.__wrap(ret);
    }
    /**
     * @param {PseudonymizationInfo} x
     * @returns {RekeyInfo}
     */
    static fromPseudoInfo(x) {
        _assertClass(x, PseudonymizationInfo);
        const ret = wasm.rekeyinfo_fromPseudoInfo(x.__wbg_ptr);
        return RekeyInfo.__wrap(ret);
    }
}

const RerandomizeFactorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_rerandomizefactor_free(ptr >>> 0, 1));

export class RerandomizeFactor {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RerandomizeFactorFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_rerandomizefactor_free(ptr, 0);
    }
}

const ReshuffleFactorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_reshufflefactor_free(ptr >>> 0, 1));

export class ReshuffleFactor {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ReshuffleFactor.prototype);
        obj.__wbg_ptr = ptr;
        ReshuffleFactorFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ReshuffleFactorFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_reshufflefactor_free(ptr, 0);
    }
}

const ScalarCanBeZeroFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_scalarcanbezero_free(ptr >>> 0, 1));

export class ScalarCanBeZero {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ScalarCanBeZero.prototype);
        obj.__wbg_ptr = ptr;
        ScalarCanBeZeroFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ScalarCanBeZeroFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_scalarcanbezero_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    encode() {
        const ret = wasm.scalarcanbezero_encode(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {ScalarCanBeZero | undefined}
     */
    static decode(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.scalarcanbezero_decode(ptr0, len0);
        return ret === 0 ? undefined : ScalarCanBeZero.__wrap(ret);
    }
    /**
     * @param {string} hex
     * @returns {ScalarCanBeZero | undefined}
     */
    static fromHex(hex) {
        const ptr0 = passStringToWasm0(hex, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.scalarcanbezero_fromHex(ptr0, len0);
        return ret === 0 ? undefined : ScalarCanBeZero.__wrap(ret);
    }
    /**
     * @returns {string}
     */
    toHex() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.scalarcanbezero_toHex(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {ScalarCanBeZero}
     */
    static one() {
        const ret = wasm.scalarcanbezero_one();
        return ScalarCanBeZero.__wrap(ret);
    }
    /**
     * @returns {ScalarCanBeZero}
     */
    static zero() {
        const ret = wasm.scalarcanbezero_zero();
        return ScalarCanBeZero.__wrap(ret);
    }
    /**
     * @returns {boolean}
     */
    isZero() {
        const ret = wasm.scalarcanbezero_isZero(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {ScalarCanBeZero} other
     * @returns {ScalarCanBeZero}
     */
    add(other) {
        _assertClass(other, ScalarCanBeZero);
        const ret = wasm.scalarcanbezero_add(this.__wbg_ptr, other.__wbg_ptr);
        return ScalarCanBeZero.__wrap(ret);
    }
    /**
     * @param {ScalarCanBeZero} other
     * @returns {ScalarCanBeZero}
     */
    sub(other) {
        _assertClass(other, ScalarCanBeZero);
        const ret = wasm.scalarcanbezero_sub(this.__wbg_ptr, other.__wbg_ptr);
        return ScalarCanBeZero.__wrap(ret);
    }
    /**
     * @returns {ScalarNonZero | undefined}
     */
    toNonZero() {
        const ret = wasm.scalarcanbezero_toNonZero(this.__wbg_ptr);
        return ret === 0 ? undefined : ScalarNonZero.__wrap(ret);
    }
}

const ScalarNonZeroFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_scalarnonzero_free(ptr >>> 0, 1));

export class ScalarNonZero {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ScalarNonZero.prototype);
        obj.__wbg_ptr = ptr;
        ScalarNonZeroFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ScalarNonZeroFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_scalarnonzero_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    encode() {
        const ret = wasm.scalarnonzero_encode(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {ScalarNonZero | undefined}
     */
    static decode(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.scalarnonzero_decode(ptr0, len0);
        return ret === 0 ? undefined : ScalarNonZero.__wrap(ret);
    }
    /**
     * @param {string} hex
     * @returns {ScalarNonZero | undefined}
     */
    static fromHex(hex) {
        const ptr0 = passStringToWasm0(hex, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.scalarnonzero_fromHex(ptr0, len0);
        return ret === 0 ? undefined : ScalarNonZero.__wrap(ret);
    }
    /**
     * @returns {string}
     */
    toHex() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.scalarnonzero_toHex(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {ScalarNonZero}
     */
    static random() {
        const ret = wasm.scalarnonzero_random();
        return ScalarNonZero.__wrap(ret);
    }
    /**
     * @param {Uint8Array} v
     * @returns {ScalarNonZero}
     */
    static fromHash(v) {
        const ptr0 = passArray8ToWasm0(v, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.scalarnonzero_fromHash(ptr0, len0);
        return ScalarNonZero.__wrap(ret);
    }
    /**
     * @returns {ScalarNonZero}
     */
    static one() {
        const ret = wasm.scalarcanbezero_one();
        return ScalarNonZero.__wrap(ret);
    }
    /**
     * @returns {ScalarNonZero}
     */
    invert() {
        const ret = wasm.scalarnonzero_invert(this.__wbg_ptr);
        return ScalarNonZero.__wrap(ret);
    }
    /**
     * @param {ScalarNonZero} other
     * @returns {ScalarNonZero}
     */
    mul(other) {
        _assertClass(other, ScalarNonZero);
        const ret = wasm.scalarnonzero_mul(this.__wbg_ptr, other.__wbg_ptr);
        return ScalarNonZero.__wrap(ret);
    }
    /**
     * @returns {ScalarCanBeZero}
     */
    toCanBeZero() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.scalarnonzero_toCanBeZero(ptr);
        return ScalarCanBeZero.__wrap(ret);
    }
}

const SessionKeyPairFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_sessionkeypair_free(ptr >>> 0, 1));

export class SessionKeyPair {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SessionKeyPair.prototype);
        obj.__wbg_ptr = ptr;
        SessionKeyPairFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SessionKeyPairFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_sessionkeypair_free(ptr, 0);
    }
    /**
     * @returns {SessionPublicKey}
     */
    get public() {
        const ret = wasm.__wbg_get_globalkeypair_public(this.__wbg_ptr);
        return SessionPublicKey.__wrap(ret);
    }
    /**
     * @param {SessionPublicKey} arg0
     */
    set public(arg0) {
        _assertClass(arg0, SessionPublicKey);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_globalkeypair_public(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {SessionSecretKey}
     */
    get secret() {
        const ret = wasm.__wbg_get_globalkeypair_secret(this.__wbg_ptr);
        return SessionSecretKey.__wrap(ret);
    }
    /**
     * @param {SessionSecretKey} arg0
     */
    set secret(arg0) {
        _assertClass(arg0, SessionSecretKey);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_globalkeypair_secret(this.__wbg_ptr, ptr0);
    }
}

const SessionKeyShareFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_sessionkeyshare_free(ptr >>> 0, 1));

export class SessionKeyShare {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SessionKeyShare.prototype);
        obj.__wbg_ptr = ptr;
        SessionKeyShareFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    static __unwrap(jsValue) {
        if (!(jsValue instanceof SessionKeyShare)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SessionKeyShareFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_sessionkeyshare_free(ptr, 0);
    }
    /**
     * @param {ScalarNonZero} x
     */
    constructor(x) {
        _assertClass(x, ScalarNonZero);
        var ptr0 = x.__destroy_into_raw();
        const ret = wasm.blindedglobalsecretkey_new(ptr0);
        this.__wbg_ptr = ret >>> 0;
        SessionKeyShareFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Uint8Array}
     */
    encode() {
        const ret = wasm.sessionkeyshare_encode(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {SessionKeyShare | undefined}
     */
    static decode(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.blindedglobalsecretkey_decode(ptr0, len0);
        return ret === 0 ? undefined : SessionKeyShare.__wrap(ret);
    }
    /**
     * @returns {string}
     */
    toHex() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.sessionkeyshare_toHex(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} hex
     * @returns {SessionKeyShare | undefined}
     */
    static fromHex(hex) {
        const ptr0 = passStringToWasm0(hex, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.blindedglobalsecretkey_fromHex(ptr0, len0);
        return ret === 0 ? undefined : SessionKeyShare.__wrap(ret);
    }
}

const SessionPublicKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_sessionpublickey_free(ptr >>> 0, 1));

export class SessionPublicKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SessionPublicKey.prototype);
        obj.__wbg_ptr = ptr;
        SessionPublicKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SessionPublicKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_sessionpublickey_free(ptr, 0);
    }
    /**
     * @returns {GroupElement}
     */
    get 0() {
        const ret = wasm.__wbg_get_globalpublickey_0(this.__wbg_ptr);
        return GroupElement.__wrap(ret);
    }
    /**
     * @param {GroupElement} arg0
     */
    set 0(arg0) {
        _assertClass(arg0, GroupElement);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_globalpublickey_0(this.__wbg_ptr, ptr0);
    }
}

const SessionSecretKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_sessionsecretkey_free(ptr >>> 0, 1));

export class SessionSecretKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SessionSecretKey.prototype);
        obj.__wbg_ptr = ptr;
        SessionSecretKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SessionSecretKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_sessionsecretkey_free(ptr, 0);
    }
    /**
     * @returns {ScalarNonZero}
     */
    get 0() {
        const ret = wasm.__wbg_get_globalsecretkey_0(this.__wbg_ptr);
        return ScalarNonZero.__wrap(ret);
    }
    /**
     * @param {ScalarNonZero} arg0
     */
    set 0(arg0) {
        _assertClass(arg0, ScalarNonZero);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_globalsecretkey_0(this.__wbg_ptr, ptr0);
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_encryptedpseudonym_unwrap = function(arg0) {
        const ret = EncryptedPseudonym.__unwrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_encrypteddatapoint_unwrap = function(arg0) {
        const ret = EncryptedDataPoint.__unwrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_encrypteddatapoint_new = function(arg0) {
        const ret = EncryptedDataPoint.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_encryptedpseudonym_new = function(arg0) {
        const ret = EncryptedPseudonym.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_sessionkeyshare_unwrap = function(arg0) {
        const ret = SessionKeyShare.__unwrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_blindingfactor_unwrap = function(arg0) {
        const ret = BlindingFactor.__unwrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_crypto_1d1f22824a6a080c = function(arg0) {
        const ret = arg0.crypto;
        return ret;
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = arg0;
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbg_process_4a72847cc503995b = function(arg0) {
        const ret = arg0.process;
        return ret;
    };
    imports.wbg.__wbg_versions_f686565e586dd935 = function(arg0) {
        const ret = arg0.versions;
        return ret;
    };
    imports.wbg.__wbg_node_104a2ff8d6ea03a2 = function(arg0) {
        const ret = arg0.node;
        return ret;
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        const ret = typeof(arg0) === 'string';
        return ret;
    };
    imports.wbg.__wbg_require_cca90b1a94a0255b = function() { return handleError(function () {
        const ret = module.require;
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(arg0) === 'function';
        return ret;
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbg_msCrypto_eb05e62b530a1508 = function(arg0) {
        const ret = arg0.msCrypto;
        return ret;
    };
    imports.wbg.__wbg_randomFillSync_5c9c955aa56b6049 = function() { return handleError(function (arg0, arg1) {
        arg0.randomFillSync(arg1);
    }, arguments) };
    imports.wbg.__wbg_getRandomValues_3aa56aa6edec874c = function() { return handleError(function (arg0, arg1) {
        arg0.getRandomValues(arg1);
    }, arguments) };
    imports.wbg.__wbg_newnoargs_1ede4bf2ebbaaf43 = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_call_a9ef466721e824f2 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.call(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_self_bf91bf94d9e04084 = function() { return handleError(function () {
        const ret = self.self;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_window_52dd9f07d03fd5f8 = function() { return handleError(function () {
        const ret = window.window;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_globalThis_05c129bf37fcf1be = function() { return handleError(function () {
        const ret = globalThis.globalThis;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_global_3eca19bb09e9c484 = function() { return handleError(function () {
        const ret = global.global;
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = arg0 === undefined;
        return ret;
    };
    imports.wbg.__wbg_call_3bfa248576352471 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.call(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_buffer_ccaed51a635d8a2d = function(arg0) {
        const ret = arg0.buffer;
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_7e3eb787208af730 = function(arg0, arg1, arg2) {
        const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_new_fec2611eb9180f95 = function(arg0) {
        const ret = new Uint8Array(arg0);
        return ret;
    };
    imports.wbg.__wbg_set_ec2fcf81bc573fd9 = function(arg0, arg1, arg2) {
        arg0.set(arg1, arg2 >>> 0);
    };
    imports.wbg.__wbg_newwithlength_76462a666eca145f = function(arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_subarray_975a06f9dbd16995 = function(arg0, arg1, arg2) {
        const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return ret;
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_0;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };

    return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('libpep_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
