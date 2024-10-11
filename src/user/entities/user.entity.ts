export class User {
    id: string;
    wallet: string;
    signature: string;
    constructor(id: string, wallet: string, signature: string) {
        this.id = id;
        this.wallet = wallet;
        this.signature = signature;
      }
}