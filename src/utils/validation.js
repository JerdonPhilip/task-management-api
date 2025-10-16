// Validation utilities
export const isValidUserId = userId => {
    return typeof userId === "string" && userId.length > 0;
};

export const isValidTaskId = taskId => {
    return typeof taskId === "string" && taskId.length > 0;
};
