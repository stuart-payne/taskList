import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "lib/sessionConfig";
import { compare } from "bcrypt";
import prismaClient from "lib/prismaClient";

interface ErrorMessage {
  message: string;
}

const login: NextApiHandler<ErrorMessage> = async (
  req: NextApiRequest,
  res: NextApiResponse<ErrorMessage>
) => {
  switch (req.method) {
    case "POST": {
      await postHandler(req, res);
      break;
    }
    default: {
      res.status(405).end();
      return;
    }
  }
};

const postHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<ErrorMessage>
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Missing credentials" });
    return;
  }

  const user = await prismaClient.user.findUnique({ where: { email } });

  if (!user) {
    res.status(404).send({ message: "User does not exist" });
    return;
  }

  if (await compare(password, user.hashedPassword)) {
    req.session.user = {
      id: user.id,
    };
    await req.session.save();
    res.status(200).end();
    return;
  } else {
    res.status(403).json({ message: "Incorrect password" });
    return;
  }
};

export default withIronSessionApiRoute(login, ironOptions);
