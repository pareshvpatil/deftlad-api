import { Controller } from "@tsed/di";
import { Get, PathParams } from "@tsed/common";
import { envs } from "src/config/envs";
import axios from "axios";
import { Required } from "@tsed/schema";
import { ContentCategory } from "src/models/ContentCategory";

@Controller("/content")
export class ContentController {

	private readonly restClient: any = null;

	constructor() {
		this.restClient = axios.create({
			baseURL: "https://neocities.org/api",
			timeout: 6000,
			headers: {
				'Authorization': `Bearer ${envs.neocities.apiKey}`
			}
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

	@Get("/projects")
	public async listProjects(): Promise<any> {
		return this.restClient.get("/list", {
			params: {
				path: envs.projectsLocation
			}
		});
	}
}
