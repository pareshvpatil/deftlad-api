import { Controller } from "@tsed/di";
import { Get, PathParams } from "@tsed/common";
import { envs } from "../../config/envs";
import axios, { AxiosInstance } from "axios";
import { Required } from "@tsed/schema";

@Controller("/content")
export class ContentController {

	private readonly restClient: AxiosInstance;
	private readonly contentRestClient: AxiosInstance;

	constructor() {
		this.restClient = axios.create({
			baseURL: "https://neocities.org/api",
			timeout: 6000,
			headers: {
				'Authorization': `Bearer ${envs.neocities.apiKey}`
			}
		});

		this.contentRestClient = axios.create({
			baseURL: "https://deftlad-content.neocities.org",
			timeout: 6000
		});
	}

	@Get("/blogs")
	public async listBlogs(): Promise<any> {
		return this.restClient.get("/list", {
			params: {
				path: envs.blogsLocation
			}
		});
	}

	@Get("/blogs/metadata")
	public async getBlogsMetadata(): Promise<any> {
		return this.contentRestClient.get<any>(
			"/content/BLOG.metadata.json"
		);
	}

	@Get("/blogs/data/:file")
	public async getBlogData(@Required() @PathParams("file") file: string): Promise<string> {
		return this.contentRestClient.get<void, string>(
			`/content/BLOG/${file}`
		);
	}

	@Get("/blogs/info/:file")
	public async getBlogInfo(@Required() @PathParams("file") file: string): Promise<any> {
		const blogs = await this.listBlogs();
		const blogInfo = blogs.data.files.find((listedFile: any) => listedFile.path.indexOf(file) >= 0);

		const blogsMetadata = await this.getBlogsMetadata();

		return {
			title: blogsMetadata.data.info[file].title,
			updatedAt: blogInfo.updated_at,
			bannerURL: `https://deftlad-content.neocities.org/resources/BLOG/${blogsMetadata.data.info[file].banner}`
		};
	}

	@Get("/projects")
	public async listProjects(): Promise<any> {
		return this.restClient.get("/list", {
			params: {
				path: envs.projectsLocation
			}
		});
	}

	@Get("/projects/metadata")
	public async getProjectsMetadata(): Promise<any> {
		return this.contentRestClient.get<any>(
			"/content/PROJECT.metadata.json"
		);
	}

	@Get("/projects/data/:file")
	public async getProjectData(@Required() @PathParams("file") file: string): Promise<string> {
		return this.contentRestClient.get<void, string>(
			`/content/PROJECT/${file}`
		);
	}

	@Get("/projects/info/:file")
	public async getProjectInfo(@Required() @PathParams("file") file: string): Promise<any> {
		const projects = await this.listProjects();
		const projectInfo = projects.data.files.find((listedFile: any) => listedFile.path.indexOf(file) >= 0);

		const projectsMetadata = await this.getProjectsMetadata();

		return {
			title: projectsMetadata.data.info[file].title,
			updatedAt: projectInfo.updated_at,
			bannerURL: `https://deftlad-content.neocities.org/resources/PROJECT/${projectsMetadata.data.info[file].banner}`
		};
	}
}
