export interface CreateTaskDto {
    userId: string;
    title: string;
    description: string;
}

export function validateCreateTaskDto(body: any): CreateTaskDto {
  if (!body.userId || !body.title || !body.description) {
    throw new Error("userId, title, and description are required");
  }

  if (typeof body.userId !== "string" ||
        typeof body.title !== "string" ||
        typeof body.description !== "string") {
    throw new Error("userId, title, and description must be strings");
  }

  return {
    userId: body.userId.trim(),
    title: body.title.trim(),
    description: body.description.trim(),
  };
}
