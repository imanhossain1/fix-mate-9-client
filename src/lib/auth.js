
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(
  `mongodb+srv://${process.env.CLIENT_SITE_DB_USER}:${process.env.CLIENT_SITE_DB_PASSOWRD}@cluster0.tcyjszt.mongodb.net/fixmate?retryWrites=true&w=majority`
);

const db = client.db("fixmate9");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  // User Additional Fields
user: {
  additionalFields: {
    role: {
      type: "string",
      required: false,
      defaultValue: "customer",
      input: true,
    },
  },
},
  
});
