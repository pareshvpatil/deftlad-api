import { Controller, Inject, PathParams } from "@tsed/common";
import { Get } from "@tsed/common";
import { ContentService, PageType } from "../../services/ContentService";
import { IBlogInfo } from "../../models/IBlogInfo";
import { Required } from "@tsed/schema";

(global as any).locationid = 1;

@Controller("/blogs")
export class BlogsController {

	@Inject()
	private readonly contentService: ContentService;

	@Get("/")
	public async listBlogs(): Promise<IBlogInfo[]> {
		return this.contentService.listBlogs();
	}

	@Get("/info/:file")
	public async getBlogInfo(@Required() @PathParams("file") file: string): Promise<any> {
		const blogsMetadata = await this.getMetadata();
		return blogsMetadata.info[file];
	}

	@Get("/metadata")
	public async getMetadata(): Promise<any> {
		return this.contentService.getPageMetadata(PageType.blog);
	}

	@Get("/recent")
	public async getRecentBlogs(): Promise<IBlogInfo[]> {
		return this.contentService.listRecentBlogs();
	}

	@Get("/content/:file")
	public async getBlogContent(@Required() @PathParams("file") file: string): Promise<string | null> {
		return this.contentService.getContent(PageType.blog, file);
	}
}
