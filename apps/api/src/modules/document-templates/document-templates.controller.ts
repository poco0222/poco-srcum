/**
 * @file Document template controller for Phase 2 formal document creation.
 * @author PopoY
 * @created 2026-06-04
 */
import { Controller, Get, Inject } from "@nestjs/common";

import { DocumentTemplatesService } from "./document-templates.service";

@Controller("/document-templates")
export class DocumentTemplatesController {
  constructor(
    @Inject(DocumentTemplatesService)
    private readonly templatesService: DocumentTemplatesService
  ) {}

  /**
   * @returns Default formal document templates available to the creation page.
   */
  @Get()
  listDefaultTemplates() {
    return this.templatesService.listDefaultTemplates();
  }
}
