import type { Task } from "@prisma/client";
export const sendEmail = (email: string, task: Task) => {
  console.log(`Sent email to: ${email} for completetion of ${task.name} task!`);
};

export const sendFailureEmail = (email: string, task: Task) => {
  console.log(`Sent email to: ${email} for failure of ${task.name}!`);
};
