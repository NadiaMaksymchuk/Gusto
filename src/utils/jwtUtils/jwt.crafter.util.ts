import { decode, encode, TAlgorithm } from 'jwt-simple'
import { EncodeResult } from '../../models/jwt/encodeResult'
import { Session } from '../../models/jwt/session'
import { DecodeResult } from '../../models/jwt/decodeResult'
import { ExpirationStatus } from '../../models/jwt/expirationStatus'
import { PartialSession } from '../../models/jwt/partialSession'

export function encodeSession(secretKey: string, partialSession: PartialSession): EncodeResult {
  // Always use HS512 to sign the token
  const algorithm: TAlgorithm = 'HS512'
  // Determine when the token should expire
  const issued = Date.now()
  const fifteenMinutesInMs = 15 * 60 * 1000
  const expires = issued + fifteenMinutesInMs
  const session: Session = {
    ...partialSession,
    issued: issued,
    expires: expires,
  }

  return {
    token: encode(session, secretKey, algorithm),
    issued: issued,
    expires: expires,
  }
}

export function decodeSession(secretKey: string, tokenString: string): DecodeResult {
  const algorithm: TAlgorithm = 'HS512'

  let result: Session

  try {
    result = decode(tokenString, secretKey, false, algorithm)
  } catch (_e) {
    const e: Error = _e as Error

    if (e.message === 'No token supplied' || e.message === 'Not enough or too many segments') {
      return {
        type: 'invalid-token',
      }
    }

    if (e.message === 'Signature verification failed' || e.message === 'Algorithm not supported') {
      return {
        type: 'integrity-error',
      }
    }

    if (e.message.indexOf('Unexpected token') === 0) {
      return {
        type: 'invalid-token',
      }
    }

    throw e
  }

  return {
    type: 'valid',
    session: result,
  }
}

export function checkExpirationStatus(token: Session): ExpirationStatus {
  const now = Date.now()

  if (token.expires > now) return 'active'

  // Find the timestamp for the end of the token's grace period
  const threeHoursInMs = 3 * 60 * 60 * 1000
  const threeHoursAfterExpiration = token.expires + threeHoursInMs

  if (threeHoursAfterExpiration > now) return 'grace'

  return 'expired'
}
