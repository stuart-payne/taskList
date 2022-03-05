import { ironOptions } from "lib/sessionConfig";
import { getIronSession } from "iron-session";
import { IncomingMessage, ServerResponse } from "http";

const res = {
  getHeader: jest.fn(),
  setHeader: jest.fn(),
};

const req = {
  headers: {},
  socket: {
    encrypted: true,
  },
};

export const generateCookie = async (user: any) => {
  const ironSession = await getIronSession(
    req as unknown as IncomingMessage,
    res as unknown as ServerResponse,
    ironOptions
  );
  ironSession.user = user;
  ironSession.save();
  console.log("hi");
  return res.setHeader.mock.calls[0][0];
};

test("test", async () => {
  expect(generateCookie({ id: 1 }));
});
