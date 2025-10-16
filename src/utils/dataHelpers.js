// Utility functions for data handling
export const validateUserData = user => {
    return typeof user.name === "string" && user.name.length > 0;
};

export const validateTaskData = task => {
    return typeof task.text === "string" && task.text.length > 0;
};
