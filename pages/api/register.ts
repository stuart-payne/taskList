import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { ironOptions } from "lib/sessionConfig";
import { withIronSessionApiRoute } from "iron-session/next";
import prismaClient from "lib/prismaClient";
import { hash } from "bcrypt";

const saltRounds = 10;

const register = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST":
      await postHandler(req, res);
      return;
    default:
      res.status(405).end();
  }
};

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).end();
  }

  const user = await prismaClient.user.findUnique({ where: { email } });

  if (user) {
    res.status(400).json({ message: "Email already taken" });
    return;
  }

  const hashedPassword = await hash(password, saltRounds);

  const savedUser = await prismaClient.user.create({
    data: { email, hashedPassword },
  });

  if (!savedUser) {
    res.status(500).json({ message: "Failed to create user" });
    return;
  } else {
    req.session.user = {
      id: savedUser.id,
    };
    await req.session.save();
    return res.status(200).end();
  }
};

export default withIronSessionApiRoute(register, ironOptions);
