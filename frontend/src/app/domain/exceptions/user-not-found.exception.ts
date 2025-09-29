export class UserNotFoundException extends Error {
  constructor(email: string) {
    super(`User with email '${email}' not found`);
    this.name = 'UserNotFoundException';
  }
}
