import { SessionAlgorithm } from "./SessionAlgorithm";
import { SignJWT, jwtVerify } from 'jose'

export class JWTSessionAlgorithm implements SessionAlgorithm {
  private JWT_secret: Uint8Array 
  
  constructor(secret: string) {
    this.JWT_secret = new TextEncoder().encode(secret)
  } 
  
  create(expiration_date: number): Promise<string> {
    console.log(expiration_date);
    return new SignJWT({ 'urn:example:claim': true })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expiration_date)
      .sign(this.JWT_secret)
  }

  async validate(token: string): Promise<boolean> {
    try {
      await jwtVerify(token, this.JWT_secret);
      return true
    } catch(error) {
      return false
    }
  }
}
