/**
 * @file NestJS authentication module shell for the Phase 1 foundation task.
 * @author PopoY
 * @created 2026-06-04
 */
import { Module } from "@nestjs/common";

import { SessionController } from "./controllers/session.controller";
import { SessionService } from "./services/session.service";

@Module({
  controllers: [SessionController],
  providers: [SessionService],
  exports: [SessionService]
})
export class AuthModule {}
