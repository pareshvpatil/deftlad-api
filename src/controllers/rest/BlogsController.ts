import { Controller } from "@tsed/common";
import { Get } from "@tsed/common";
import { envs } from "../../config/envs";
import axios, { AxiosInstance } from "axios";

@Controller("/blogs")
export class BlogsController {

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

	@Get("/recent")
	public async getRecentBlogs(): Promise<any[]> {
		const allBlogs = await this.restClient.get<any>("/list", {
			params: {
				path: envs.blogsLocation
			}
		});

		(allBlogs.data.files as any[]).sort((blog1, blog2) => new Date(blog2.updated_at).getTime() - new Date(blog1.updated_at).getTime());

		allBlogs.data.files = allBlogs.data.files.slice(0, 3);

		return allBlogs.data;
	}
}
