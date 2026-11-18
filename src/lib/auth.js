
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(
  `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.tcyjszt.mongodb.net/fixmate?retryWrites=true&w=majority`
);

const db = client.db("fixmate");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  // users role
  user: {
  additionalFields: {
    role: {
      type: "string",
      defaultValue: "customer",
      input: false,
    },
  },
},
  
});
