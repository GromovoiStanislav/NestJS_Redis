import { Controller, Get, Param, Query } from "@nestjs/common";
import { CommentsService } from "./comments.service";

@Controller("comments")
export class CommentsController {

  constructor(
    private commentsService: CommentsService
  ) {
  }


  @Get(":postId")
  async fetchOrders(
    @Param("postId") postId: string,
    @Query("skip") skip: string,
    @Query("take") take: string
  ) {
    return this.commentsService.getPostComments(parseInt(postId), parseInt(skip), parseInt(take));
  }

}
