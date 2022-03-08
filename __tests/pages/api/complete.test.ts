import { generateFakeCookie } from "__tests/helpers";
import handler from "pages/api/complete";
import { NextApiRequest, NextApiResponse } from "next";
import prismaClient from "lib/prismaClient";

jest.mock("lib/prismaClient", () => {
  return {
    __esModule: true,
    default: {
      user: {
        findUnique: jest.fn(() => ({ id: 1 })),
      },
      task: {
        updateMany: jest.fn(),
        update: jest.fn(),
      },
    },
  };
});

const endFake = jest.fn();
const statusFake = jest.fn(() => {
  return {
    end: endFake,
  };
});

const resFake: unknown = {
  status: statusFake,
};

describe("complete api", () => {
  it("rejects unsupported method", async () => {
    const reqFake: unknown = {
      method: "DELETE",
      headers: {
        cookie: await generateFakeCookie({ id: 1 }),
      },
    };
    await handler(reqFake as NextApiRequest, resFake as NextApiResponse);
    expect(statusFake).toBeCalledWith(405);
  });
});
