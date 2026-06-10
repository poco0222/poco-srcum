/**
 * @file Basic search controller for Phase 2 delivery evidence lookup.
 * @author PopoY
 * @created 2026-06-10
 */
import { Controller, Get, Inject, Query } from "@nestjs/common";

import type {
  DocumentReviewStatusValue,
  LinkageObjectTypeValue
} from "@poco-scrum/domain";
import { SearchService } from "./search.service";

@Controller("/search")
export class SearchController {
  constructor(
    @Inject(SearchService)
    private readonly searchService: SearchService
  ) {}

  /**
   * @param keyword The user-entered search keyword.
   * @param objectType Optional object type filter.
   * @param reviewStatus Optional review status filter.
   * @returns Basic search result cards.
   */
  @Get()
  search(
    @Query("keyword") keyword = "",
    @Query("objectType") objectType?: LinkageObjectTypeValue,
    @Query("reviewStatus") reviewStatus?: DocumentReviewStatusValue
  ) {
    return this.searchService.search({
      keyword,
      objectType,
      reviewStatus
    });
  }
}
