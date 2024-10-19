import { PromiseDeconstructed, QUICStream } from '@matrixai/quic';
import * as peculiarWebcrypto from '@peculiar/webcrypto';
const webcrypto = new peculiarWebcrypto.Crypto();

export async function keyPairRSAToPEM(keyPair: {
  publicKey: JsonWebKey;
  privateKey: JsonWebKey;
}): Promise<{
  publicKey: string;
  privateKey: string;
}> {
  const publicKey = await importPublicKey(keyPair.publicKey);
  const privatekey = await importPrivateKey(keyPair.privateKey);
  const publicKeySPKI = await webcrypto.subtle.exportKey('spki', publicKey);
  const publicKeySPKIBuffer = Buffer.from(publicKeySPKI);
  const publicKeyPEMBody =
    publicKeySPKIBuffer
      .toString('base64')
      .replace(/(.{64})/g, '$1\n')
      .trimEnd() + '\n';
  const publicKeyPEM = `-----BEGIN PUBLIC KEY-----\n${publicKeyPEMBody}\n-----END PUBLIC KEY-----\n`;
  const privateKeyPKCS8 = await webcrypto.subtle.exportKey('pkcs8', privatekey);
  const privateKeyPKCS8Buffer = Buffer.from(privateKeyPKCS8);
  const privateKeyPEMBody =
    privateKeyPKCS8Buffer
      .toString('base64')
      .replace(/(.{64})/g, '$1\n')
      .trimEnd() + '\n';
  const privateKeyPEM = `-----BEGIN PRIVATE KEY-----\n${privateKeyPEMBody}-----END PRIVATE KEY-----\n`;
  return {
    publicKey: publicKeyPEM,
    privateKey: privateKeyPEM,
  };
}

/**
 * Imports public key.
 * This uses `@peculiar/webcrypto` API for Ed25519 keys.
 */
export async function importPublicKey(publicKey: JsonWebKey): Promise<CryptoKey> {
  let algorithm;
  switch (publicKey.kty) {
    case 'RSA':
      switch (publicKey.alg) {
        case 'RS256':
          algorithm = {
            name: 'RSASSA-PKCS1-v1_5',
            hash: 'SHA-256',
          };
          break;
        case 'RS384':
          algorithm = {
            name: 'RSASSA-PKCS1-v1_5',
            hash: 'SHA-384',
          };
          break;
        case 'RS512':
          algorithm = {
            name: 'RSASSA-PKCS1-v1_5',
            hash: 'SHA-512',
          };
          break;
        default:
          throw new Error(`Unsupported algorithm ${publicKey.alg}`);
      }
      break;
    case 'EC':
      switch (publicKey.crv) {
        case 'P-256':
          algorithm = {
            name: 'ECDSA',
            namedCurve: 'P-256',
          };
          break;
        case 'P-384':
          algorithm = {
            name: 'ECDSA',
            namedCurve: 'P-384',
          };
          break;
        case 'P-521':
          algorithm = {
            name: 'ECDSA',
            namedCurve: 'P-521',
          };
          break;
        default:
          throw new Error(`Unsupported curve ${publicKey.crv}`);
      }
      break;
    case 'OKP':
      algorithm = {
        name: 'EdDSA',
        namedCurve: 'Ed25519',
      };
      break;
    default:
      throw new Error(`Unsupported key type ${publicKey.kty}`);
  }
  return await webcrypto.subtle.importKey('jwk', publicKey, algorithm, true, [
    'verify',
  ]);
}

/**
 * Imports private key.
 * This uses `@peculiar/webcrypto` API for Ed25519 keys.
 */
export async function importPrivateKey(privateKey: JsonWebKey): Promise<CryptoKey> {
  let algorithm;
  switch (privateKey.kty) {
    case 'RSA':
      switch (privateKey.alg) {
        case 'RS256':
          algorithm = {
            name: 'RSASSA-PKCS1-v1_5',
            hash: 'SHA-256',
          };
          break;
        case 'RS384':
          algorithm = {
            name: 'RSASSA-PKCS1-v1_5',
            hash: 'SHA-384',
          };
          break;
        case 'RS512':
          algorithm = {
            name: 'RSASSA-PKCS1-v1_5',
            hash: 'SHA-512',
          };
          break;
        default:
          throw new Error(`Unsupported algorithm ${privateKey.alg}`);
      }
      break;
    case 'EC':
      switch (privateKey.crv) {
        case 'P-256':
          algorithm = {
            name: 'ECDSA',
            namedCurve: 'P-256',
          };
          break;
        case 'P-384':
          algorithm = {
            name: 'ECDSA',
            namedCurve: 'P-384',
          };
          break;
        case 'P-521':
          algorithm = {
            name: 'ECDSA',
            namedCurve: 'P-521',
          };
          break;
        default:
          throw new Error(`Unsupported curve ${privateKey.crv}`);
      }
      break;
    case 'OKP':
      algorithm = {
        name: 'EdDSA',
        namedCurve: 'Ed25519',
      };
      break;
    default:
      throw new Error(`Unsupported key type ${privateKey.kty}`);
  }
  return await webcrypto.subtle.importKey('jwk', privateKey, algorithm, true, [
    'sign',
  ]);
}

export async function generateKeyHMAC(): Promise<ArrayBuffer> {
  const cryptoKey = await webcrypto.subtle.generateKey(
    {
      name: 'HMAC',
      hash: 'SHA-256',
    },
    true,
    ['sign', 'verify'],
  );
  const key = await webcrypto.subtle.exportKey('raw', cryptoKey);
  return key;
}

export async function signHMAC(key: ArrayBuffer, data: ArrayBuffer) {
  const cryptoKey = await webcrypto.subtle.importKey(
    'raw',
    key,
    {
      name: 'HMAC',
      hash: 'SHA-256',
    },
    true,
    ['sign', 'verify'],
  );
  return webcrypto.subtle.sign('HMAC', cryptoKey, data);
}

export async function verifyHMAC(
  key: ArrayBuffer,
  data: ArrayBuffer,
  sig: ArrayBuffer,
) {
  const cryptoKey = await webcrypto.subtle.importKey(
    'raw',
    key,
    {
      name: 'HMAC',
      hash: 'SHA-256',
    },
    true,
    ['sign', 'verify'],
  );
  return webcrypto.subtle.verify('HMAC', cryptoKey, sig, data);
}

export async function randomBytes(data: ArrayBuffer) {
  webcrypto.getRandomValues(new Uint8Array(data));
}

export function promise<T = void>(): PromiseDeconstructed<T> {
  let resolveP, rejectP;
  const p = new Promise<T>((resolve, reject) => {
    resolveP = resolve;
    rejectP = reject;
  });
  return {
    p,
    resolveP,
    rejectP,
  };
}

export async function writeTo<T>(stream: QUICStream, msg: T) {
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();
  const encReq = encoder.encode(JSON.stringify(msg));
  let writtenLen = 0;
  let totalWriteLen = encReq.length;
  // write the size of msg
  await writer.write(numberToU8Array(totalWriteLen))
  console.log(`write len ${numberToU8Array(totalWriteLen)}`)
  while (writtenLen < totalWriteLen) {
    let bz = encReq.subarray(writtenLen, writtenLen + 1000)
    await writer.write(bz)
    console.log(`write ${bz}`)
    writtenLen += 1000;
  }
}

export async function readFrom<T>(stream: QUICStream): Promise<T> {
  let collectedEncRes: Uint8Array[] = [];
  let totalReadLen: number = undefined;
  let readLen = 0;
  for await (const encRes of stream.readable) {
    if (!totalReadLen) {
      totalReadLen = u8ArrayToNumber(encRes);
    } else {
      collectedEncRes.push(encRes)
      readLen += encRes.length
      if (readLen == totalReadLen) {
        break;
      }
    }
  }

  let encRes = combineUint8Arrays(collectedEncRes);
  const decoder = new TextDecoder('utf-8');
  let jsonRes = decoder.decode(encRes)
  let res: T = JSON.parse(jsonRes);
  return res
}

function combineUint8Arrays(arrays: Uint8Array[]): Uint8Array {
  // Calculate the total length
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);

  // Create a new Uint8Array with the total length
  const combinedArray = new Uint8Array(totalLength);

  // Keep track of the current index
  let offset = 0;

  // Copy each array into the combined array
  arrays.forEach(arr => {
    combinedArray.set(arr, offset);
    offset += arr.length;
  });

  return combinedArray;
}

function numberToU8Array(num): Uint8Array {
  if (num < 0 || num > 65535) {
    throw new RangeError('Number must be between 0 and 65535');
  }
  const highByte = (num >> 8) & 0xFF;
  const lowByte = num & 0xFF;
  return new Uint8Array([highByte, lowByte]);
}

function u8ArrayToNumber(u8Array): number {
  if (u8Array.length !== 2) {
    throw new Error('Uint8Array must have exactly 2 elements');
  }

  const highByte = u8Array[0];  // Most significant byte
  const lowByte = u8Array[1];   // Least significant byte

  return (highByte << 8) | lowByte;
}