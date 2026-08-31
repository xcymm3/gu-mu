import { startStaticServer } from "./static-server.mjs";

export default async function globalSetup() {
  const stopStaticServer = await startStaticServer();
  return stopStaticServer;
}
