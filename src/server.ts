import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { getAllPromptsRoute } from "./routes/get-all-prompts";
import { generationAICompletionRoute } from "./routes/generate-ai-completion";

import 'dotenv/config';

const app = fastify();

app.register(fastifyCors, {
  origin: '*',
});

app.register(getAllPromptsRoute);
app.register(generationAICompletionRoute);

app.listen({
  host: process.env.MOBILE_HOST,
  port: Number(process.env.PORT),
}).then(() => {
  console.log("HTTP Server running!")
});