import type { KudoStyle } from "@prisma/client";
import { prisma } from "./prisma.server";

export const createKudo = async (
  message: string,
  userId: string,
  recipientId: string,
  style: KudoStyle
) => {
  await prisma.kudo.create({
    data: {
      message,
      style,
      author: {
        connect: {
          id: userId,
        },
      },
      recipient: {
        connect: {
          id: recipientId,
        },
      },
    },
  });
};
