import { ServerResponse } from "http";
import { getIronSession } from "iron-session";
import { ironOptions } from "lib/sessionConfig";
/**
 * creates a cookie using iron session for testing purposes
 * @param sessionData any data you want stored in the cookie
 * @returns the cookie generated as a string
 */

export const generateFakeCookie = async (sessionData: any) => {
  const fakeReq: any = { headers: { cookie: undefined } };
  const response = new ServerResponse(fakeReq);
  const ironSesh = await getIronSession(fakeReq, response, ironOptions);
  ironSesh.user = sessionData;
  await ironSesh.save();
  const header = response.getHeader("set-cookie");
  if (Array.isArray(header)) {
    return header[0];
  } else {
    throw new Error("Cookie should always be set to an array of cookies");
  }
};
