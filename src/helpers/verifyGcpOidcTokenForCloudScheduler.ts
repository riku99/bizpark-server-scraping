import jwksClient from 'jwks-rsa';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

interface GoogleOIDCToken {
  aud: string;
  azp: string;
  email: string;
  email_verified: boolean;
  exp: number;
  iat: number;
  iss: string;
  sub: string;
}

// tokenの署名を検証するための公開鍵を取得するためのクラス
const client = jwksClient({
  jwksUri: 'https://www.googleapis.com/oauth2/v3/certs',
});

// 公開鍵の取得
function getKey(header: any, callback: any): void {
  client.getSigningKey(header.kid, (err: any, key: any) => {
    if (err !== null) return callback(err);
    const signingKey = key.publicKey ?? key.rsaPublicKey;
    callback(null, signingKey);
  });
}

// トークンの検証
async function verifyToken(token: string): Promise<GoogleOIDCToken> {
  return await new Promise((resolve, reject) => {
    // Notice here we're using the `getKey` function defined above
    jwt.verify(token, getKey, (err, decoded) => {
      if (err !== null) return reject(err);
      return resolve(decoded as GoogleOIDCToken);
    });
  });
}

export const verifyGcpOidcTokenForCloudScheduler = async (
  req: Request,
  res: Response
): Promise<Boolean> => {
  if (!req.headers.authorization) {
    res.status(403).send('Not Include authorization');
    return false;
  }

  if (req.headers['user-agent'] !== 'Google-Cloud-Scheduler') {
    res.status(403).send('Invalid user agent');
    return false;
  }

  try {
    const token = await verifyToken(req.headers.authorization.split(' ')[1]);

    if (token.iss !== 'https://accounts.google.com') {
      res.status(403).send('Invalid issuer');
      return false;
    }

    return true;
  } catch (e) {
    console.log(e);
    res.status(403).send('Invalid OIDC token');
    return false;
  }
};
