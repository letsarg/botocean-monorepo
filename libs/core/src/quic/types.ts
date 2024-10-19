export class QuicServerConfig {
  host: string;
  port: number;
  privkey_path: string;
  pubkey_path: string;
  cert_path: string;
}

export class QuicClientConfig {
  host: string;
  port: number;
}