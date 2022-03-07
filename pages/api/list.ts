import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "lib/sessionConfig";
import prismaClient from "lib/prismaClient";
import { checkUser } from "./task";
import { User, Task, prisma } from "@prisma/client";

const list = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await checkUser(req, res);

  if (!user) {
    return;
  }

  switch (req.method) {
    case "GET":
      await getHandler(req, res, user);
      break;
    case "POST":
      await postHandler(req, res, user);
      break;
    case "PATCH":
      await patchHandler(req, res, user);
      break;
    case "DELETE":
      await deleteHandler(req, res);
      break;
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
  if (listId) {
    if (typeof listId !== "string") {
      res.status(400).end();
      return;
    }
    const parsedId = parseInt(listId);
    res.status(200).json(
      await prismaClient.list.findUnique({
        where: { id: parsedId },
        include: { tasks: true },
      })
    );
    return;
  } else {
    res
      .status(200)
      .json(await prismaClient.list.findMany({ where: { userId: user.id } }));
  }
};

const postHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: User
) => {
  const { name } = req.body;

  if (!name) {
    res.status(400).end();
  }

  await prismaClient.list.create({
    data: { name, user: { connect: { id: user.id } } },
  });
  res.status(200).end();
};

const patchHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: User
) => {
  const { id, newName } = req.body;

  if (!id || !newName) {
    res.status(400).end();
    return;
  }

  await prismaClient.list.update({ where: { id }, data: { name: newName } });
  res.status(200).end();
  return;
};

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.body;

  if (!id) {
    res.status(400).end();
    return;
  }

  await prismaClient.task.deleteMany({ where: { listId: id } });

  await prismaClient.list.delete({ where: { id } });

  res.status(200).end();
  return;
};

export default withIronSessionApiRoute(list, ironOptions);
