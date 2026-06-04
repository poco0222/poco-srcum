/**
 * @file NestJS application bootstrap entry for the Phase 1 bootstrap task.
 * @author PopoY
 * @created 2026-06-04
 */
import "reflect-metadata";

import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";

/**
 * @description Creates the API application so smoke tests and runtime bootstrap share one factory.
 * @returns The initialized NestJS application instance.
 */
export async function createApiApp() {
  return NestFactory.create(AppModule, {
    logger: ["error", "warn", "log"]
  });
}

/**
 * @description Boots the API shell when the file is executed directly.
 * @returns Promise that resolves once the HTTP server starts listening.
 */
export async function bootstrap() {
  const application = await createApiApp();

  await application.listen(3001);
  return application;
}

if (require.main === module) {
  void bootstrap();
}
