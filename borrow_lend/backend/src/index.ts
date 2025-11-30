import app from "./app.js";
import { env } from "./config/env.js";

/**
 * Starts the Express server
 * Listens on the configured PORT from environment variables
 */
app.listen(env.PORT, () => {
  console.log(`API listening on http://localhost:${env.PORT}`);
});