export interface PasswordHash {
  hash(password: string): Promise<string>
  compare(plainTextPassowrd: string, passwordHash: string): Promise<boolean>
}
