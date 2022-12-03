import { Controller, Inject, PathParams } from "@tsed/common";
import { Get } from "@tsed/common";
import { ContentService, PageType } from "../../services/ContentService";
import { IBlogInfo } from "../../models/IBlogInfo";
import { Required } from "@tsed/schema";

(global as any).locationid = 1;

@Controller("/projects")
export class ProjectsController {

	@Inject()
	private readonly contentService: ContentService;

	@Get("/")
	public async listProjects(): Promise<IBlogInfo[]> {
		return this.contentService.listProjects();
	}

	@Get("/info/:file")
	public async getBlogInfo(@Required() @PathParams("file") file: string): Promise<any> {
		const projectsMetadata = await this.getMetadata();
		return projectsMetadata.info[file];
	}

	@Get("/metadata")
	public async getMetadata(): Promise<any> {
		return this.contentService.getPageMetadata(PageType.project);
	}

	@Get("/recent")
	public async getRecentBlogs(): Promise<IBlogInfo[]> {
		return this.contentService.listRecentProjects();
	}

	@Get("/content/:file")
	public async getBlogContent(@Required() @PathParams("file") file: string): Promise<string | null> {
		return this.contentService.getContent(PageType.project, file);
	}
}
