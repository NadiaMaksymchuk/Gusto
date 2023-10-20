import { Request, Response, NextFunction } from "express";
import { DecodeResult } from "../models/jwt/decodeResult";
import { Session } from "../models/jwt/session";
import { decodeSession, encodeSession, checkExpirationStatus } from "../utils/jwtUtils/jwt.crafter.util";
import { ExpirationStatus } from "../models/jwt/expirationStatus";

/**
 * Express middleware, checks for a valid JSON Web Token and returns 401 Unauthorized if one isn't found.
 */
export function requireJwtMiddleware(request: Request, response: Response, next: NextFunction) {
    const crypto = require('crypto');

    const SECRET_KEY = crypto.randomBytes(32).toString('hex');

    const unauthorized = (message: string) => response.status(401).json({
        ok: false,
        status: 401,
        message: message
    });

    const requestHeader = "X-JWT-Token";
    const responseHeader = "X-Renewed-JWT-Token";
    const header = request.header(requestHeader);

    if (!header) {
        unauthorized(`Required ${requestHeader} header not found.`);
        return;
    }

    const decodedSession: DecodeResult = decodeSession(SECRET_KEY, header);

    if (decodedSession.type === "integrity-error" || decodedSession.type === "invalid-token") {
        unauthorized(`Failed to decode or validate authorization token. Reason: ${decodedSession.type}.`);
        return;
    }

    const expiration: ExpirationStatus = checkExpirationStatus(decodedSession.session);

    if (expiration === "expired") {
        unauthorized(`Authorization token has expired. Please create a new authorization token.`);
        return;
    }

    let session: Session;

    if (expiration === "grace") {
        const { token, expires, issued } = encodeSession(SECRET_KEY, decodedSession.session);
        session = {
            ...decodedSession.session,
            expires: expires,
            issued: issued
        };

        response.setHeader(responseHeader, token);
    } else {
        session = decodedSession.session;
    }

    response.locals = {
        ...response.locals,
        session: session
    };

    next();
}