import { MySession } from "../app/types/types";

export const customGet = async (url: string, session: MySession | null) => {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  }).then((res) => res.json());

  return res;
};