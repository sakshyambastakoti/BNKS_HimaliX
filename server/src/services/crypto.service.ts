import crypto from 'crypto';
import { db } from '../database/db.js';

export interface BondSignPayload {
  bondId: string;
  value: number;
  ownerId: string;
  issuedAt: string;
  expiresAt: string;
}

export class CryptoService {
  private static serverPublicKey: string = '';
  private static serverPrivateKey: string = '';
  private static isInitialized = false;

  /**
   * Initializes or loads the server's Ed25519 keypair from the database
   */
  public static async initialize(): Promise<void> {
    if (this.isInitialized) return;

    const row = await db.get<{ public_key: string; private_key: string }>(
      'SELECT public_key, private_key FROM server_keys WHERE id = 1'
    );

    if (row) {
      this.serverPublicKey = row.public_key;
      this.serverPrivateKey = row.private_key;
      console.log('🔑 Loaded existing Server Ed25519 Keypair from database.');
    } else {
      console.log('⚡ Generating new Server Ed25519 Keypair...');
      const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      });

      this.serverPublicKey = publicKey;
      this.serverPrivateKey = privateKey;

      await db.run(
        'INSERT INTO server_keys (id, public_key, private_key, created_at) VALUES (1, ?, ?, ?)',
        [publicKey, privateKey, new Date().toISOString()]
      );
      console.log('✅ Server Ed25519 Keypair saved to database.');
    }

    this.isInitialized = true;
  }

  /**
   * Returns server's public key (PEM format or Hex)
   */
  public static getServerPublicKey(): string {
    return this.serverPublicKey;
  }

  /**
   * Creates a SHA-256 hash of any input string or buffer
   */
  public static sha256(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Mints and cryptographically signs a digital bond token using Ed25519
   */
  public static signBond(payload: BondSignPayload): string {
    if (!this.serverPrivateKey) {
      throw new Error('CryptoService not initialized: Private key missing');
    }

    // Construct deterministic payload string
    const message = `${payload.bondId}:${payload.value}:${payload.ownerId}:${payload.issuedAt}:${payload.expiresAt}:OFFPAY_SERVER`;
    const digest = Buffer.from(this.sha256(message), 'hex');

    const signature = crypto.sign(null, digest, this.serverPrivateKey);
    return signature.toString('hex');
  }

  /**
   * Verifies a server signature on a bond token
   */
  public static verifyBondSignature(payload: BondSignPayload, signatureHex: string): boolean {
    if (!this.serverPublicKey) {
      throw new Error('CryptoService not initialized: Public key missing');
    }

    try {
      const message = `${payload.bondId}:${payload.value}:${payload.ownerId}:${payload.issuedAt}:${payload.expiresAt}:OFFPAY_SERVER`;
      const digest = Buffer.from(this.sha256(message), 'hex');
      const signature = Buffer.from(signatureHex, 'hex');

      return crypto.verify(null, digest, this.serverPublicKey, signature);
    } catch (err) {
      console.error('Error verifying bond signature:', err);
      return false;
    }
  }

  /**
   * Verifies client Ed25519 signature on an offline transaction payload
   */
  public static verifyClientTransactionSignature(
    payloadString: string,
    signatureHex: string,
    clientPublicKeyPem: string
  ): boolean {
    try {
      const digest = Buffer.from(this.sha256(payloadString), 'hex');
      const signature = Buffer.from(signatureHex, 'hex');

      return crypto.verify(null, digest, clientPublicKeyPem, signature);
    } catch (err) {
      console.error('Error verifying client signature:', err);
      return false;
    }
  }
}
