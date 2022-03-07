import prismaClient from "lib/prismaClient";
import { sendFailureEmail } from "lib/sendEmail";
import type { Task } from "@prisma/client";

/*
  This is the code that would check the tasks for any that have not
  been completed and have passed their deadline.

  Next doesn't have a clean place to run this script so I hace left it
  out for now. This code could run in it's own service that would  poll
  the database on regular intervals such as every minute or so.
*/

export const deadlineCheck = async () => {
  const currentDatetime = new Date();
  const tasks = await prismaClient.task.findMany({
    where: {
      AND: [
        {
          deadline: {
            lt: currentDatetime,
          },
        },
        {
          completed: false,
        },
      ],
    },
    include: {
      user: true,
    },
  });

  for (const task of tasks) {
    sendFailureEmail(task.user.email, task);
    await prismaClient.task.update({
      where: {
        id: task.id,
      },
      data: {
        failed: true,
      },
    });
  }
};
