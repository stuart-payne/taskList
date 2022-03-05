import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "lib/sessionConfig";

const logout: NextApiHandler = (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST":
      req.session.destroy();
      res.redirect("/login");
      return;
    default:
      res.status(405).end();
  }
};

export default withIronSessionApiRoute(logout, ironOptions);
