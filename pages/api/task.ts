import type { NextApiRequest, NextApiResponse } from "next";
import { ironOptions } from "lib/sessionConfig";
import { withIronSessionApiRoute } from "iron-session/next";
import prismaClient from "lib/prismaClient";
import { User, Task } from "@prisma/client";

export const checkUser = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<User | null> => {
  if (!req.session.user) {
    res.status(401).redirect("/login");
    return null;
  }

  if (!req.session.user.id) {
    req.session.destroy();
    res.status(401).redirect("/login");
    return null;
  }

  return await prismaClient.user.findUnique({
    where: { id: req.session.user.id },
  });
};

const task = async (req: NextApiRequest, res: NextApiResponse) => {
  // make sure user is authenticated

  const user = await checkUser(req, res);

  if (!user) {
    return;
  }

  switch (req.method) {
    case "GET":
      await getHandler(req, res, user);
      return;
    case "POST":
      await postHandler(req, res, user);
      return;
    case "DELETE":
      await deleteHandler(req, res);
      return;
    case "PUT":
      await putHandler(req, res);
      return;
    case "PATCH":
      console.log("got here");
      await patchHandler(req, res);
      return;
    default:
      res.status(405).end();
      return;
  }
};

const getHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: User
) => {
  const { listId } = req.query;
  if (!listId) {
    res
      .status(200)
      .json(await prismaClient.task.findMany({ where: { userId: user.id } }));
    return;
  } else {
    if (typeof listId !== "string") {
      res.status(400).end();
      return;
    }
    const parsedListId = parseInt(listId);
    if (isNaN(parsedListId)) {
      res.status(400).end();
      return;
    }
    res.status(200).json(
      await prismaClient.task.findMany({
        where: { AND: [{ userId: user.id }, { listId: parsedListId }] },
      })
    );
  }
};

const postHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: User
) => {
  const { name, description, deadline, listId } = req.body;

  if (!name || !description || !deadline || !listId) {
    res.status(400).end();
    return;
  }

  const parsedDeadline = new Date(deadline);

  // check for valid Date object
  if (isNaN(parsedDeadline.valueOf())) {
    res.status(400).end();
    return;
  }

  const newTask = await prismaClient.task.create({
    data: {
      name,
      description,
      deadline: parsedDeadline,
      user: {
        connect: {
          id: user.id,
        },
      },
      list: {
        connect: {
          id: listId,
        },
      },
    },
  });
  res.status(200).end();
};

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, batch } = req.body;

  if (batch) {
    const batchPayload = await prismaClient.task.deleteMany({
      where: {
        OR: batch.map((taskId: number) => ({ id: taskId })),
      },
    });
    res.status(200).json({ batchPayload });
    return;
  } else if (id) {
    await prismaClient.task.delete({ where: { id } });
    res.status(200).end();
    return;
  } else {
    res.status(400).end();
    return;
  }
};

const putHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, name, description, deadline } = req.body;

  if (!id || !name || !description || !deadline) {
    res.status(400).end();
    return;
  }

  const parsedDeadline = new Date(deadline);

  // check for valid Date object
  if (isNaN(parsedDeadline.valueOf())) {
    res.status(400).end();
    return;
  }

  await prismaClient.task.update({
    where: { id },
    data: {
      id,
      name,
      description,
      deadline: parsedDeadline,
    },
  });
  res.status(200).end();
  return;
};

const patchHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { batch, listId } = req.body;

  console.log(batch);
  console.log(listId);

  if (!Array.isArray(batch) || !listId || isNaN(listId)) {
    res.status(400).end();
    return;
  }

  await prismaClient.task.updateMany({
    where: {
      OR: batch.map((id: number) => ({ id })),
    },
    data: {
      listId,
    },
  });

  res.status(200).end();
  return;
};

export default withIronSessionApiRoute(task, ironOptions);
