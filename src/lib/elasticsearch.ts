import { Client } from "@elastic/elasticsearch";
import fs from "fs";


export const client_elastic = new Client({
  node: "https://localhost:9200",
  auth: {
    username: "elastic",
    password: process.env.PASSELASTIC as string,
  },
  tls: {
    ca: fs.readFileSync("certs/http_ca.crt"),
    rejectUnauthorized: true, // valide le certificat serveur avec le CA
  },
});
