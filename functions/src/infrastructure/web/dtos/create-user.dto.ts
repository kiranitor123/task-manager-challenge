export interface CreateUserDto {
  email: string;
}

export function validateCreateUserDto(body: any): CreateUserDto {
  if (!body.email) {
    throw new Error("Email is required");
  }

  if (typeof body.email !== "string") {
    throw new Error("Email must be a string");
  }

  return {
    email: body.email.trim(),
  };
}
