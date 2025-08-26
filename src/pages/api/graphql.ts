import { ApolloServer, AuthenticationError } from "apollo-server-micro";
import jwt from "jsonwebtoken";
import { typeDefs, resolvers } from "../../lib/schema";
import { users, CourseEnrolled } from "../../lib/users";
import { secret } from "../../lib/auth";

import { Token_Type } from "@/lib/types";
import { NextApiRequest, NextApiResponse } from "next";

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || "";
    let currentUser:Token_Type | null = null;

    if (token) {
      try {
        currentUser = jwt.verify(token.replace("Bearer ", ""), secret) as Token_Type;
      } catch (e) {
        console.log(e);
        throw new AuthenticationError("Invalid or expired token");
      }
    }

    return {
      user: currentUser,
      users,
      CourseEnrolled,
    };
  },
  formatError: (err) => ({
    message: err.message,
    code: err.extensions?.code || "INTERNAL_SERVER_ERROR",
  }),
});

const startServer = apolloServer.start();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.end();
    return;
  }

  await startServer;
  await apolloServer.createHandler({ path: "/api/graphql" })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
