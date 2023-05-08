import { compare, hash } from "bcrypt";

export class HashService {
	public async hash(plainString: string): Promise<string> {
		return hash(plainString, 10);
	}

	public async compare(plainString: string, hashedString: string): Promise<boolean> {
		return compare(plainString, hashedString);
	}
}
