import type { NextApiRequest, NextApiResponse } from "next";
import { ironOptions } from "lib/sessionConfig";
import prismaClient from "lib/prismaClient";
import { withIronSessionApiRoute } from "iron-session/next";
import { checkUser } from "./task";
import { sendEmail } from "lib/sendEmail";
import type { User, Task } from "@prisma/client";

const complete = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await checkUser(req, res);

  if (!user) {
    return;
  }

  switch (req.method) {
    case "POST":
      await postHandler(req, res, user);
      break;
    default:
      res.status(405).end();
  }
};

const postHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: User
) => {
  const { id, batch } = req.body;

  if (batch) {
    if (!Array.isArray(batch)) {
      res.status(400).end();
    }
    await prismaClient.task.updateMany({
      where: {
        OR: batch.map((taskId: number) => ({
          id: taskId,
        })),
      },
      data: {
        completed: true,
      },
    });

    sendEmail(user.email, { name: "Batch" } as Task);
    res.status(200).end();
    return;
  } else if (id) {
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      res.status(400).end();
      return;
    }
    const task = await prismaClient.task.update({
      where: { id: parsedId },
      data: { completed: true },
    });

    sendEmail(user.email, task);

    res.status(200).end();
    return;
  } else {
    res.status(400).end();
  }
};

export default withIronSessionApiRoute(complete, ironOptions);
