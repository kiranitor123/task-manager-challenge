export interface UpdateTaskDto {
    title?: string;
    description?: string;
    completed?: boolean;
}

export function validateUpdateTaskDto(body: any): UpdateTaskDto {
  const dto: UpdateTaskDto = {};

  if (body.title !== undefined) {
    if (typeof body.title !== "string") {
      throw new Error("Title must be a string");
    }
    dto.title = body.title.trim();
  }

  if (body.description !== undefined) {
    if (typeof body.description !== "string") {
      throw new Error("Description must be a string");
    }
    dto.description = body.description.trim();
  }

  if (body.completed !== undefined) {
    if (typeof body.completed !== "boolean") {
      throw new Error("Completed must be a boolean");
    }
    dto.completed = body.completed;
  }

  // At least one field must be provided
  if (Object.keys(dto).length === 0) {
    throw new Error("At least one field must be updated");
  }

  return dto;
}
