import { Controller } from "@tsed/common";
import { Get } from "@tsed/common";
import { envs } from "../../config/envs";
import axios, { AxiosInstance } from "axios";
import pcloudSdk, { Client } from 'pcloud-sdk-js';

(global as any).locationid = 1;

@Controller("/blogs")
export class BlogsController {

	private readonly restClient: AxiosInstance;
	private readonly contentRestClient: AxiosInstance;
	private readonly pcloudClient: Client;

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

		this.pcloudClient = pcloudSdk.createClient('Ryef7ZWrFt3J6een0ZxMWgc7Zfxhxq1eB5tfzhLpKSs69y7fzuq9k');
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

	@Get("/content")
	public async getBlogContent(): Promise<any> {
		const response = await this.pcloudClient.api('listfolder', {
			params: {
				path: '/content/blogs'
			}
		});

		const dockerBlog = ((response as any).metadata.contents as any[]).find(content => content.name === 'local-docker-setup.md');

		const fileLinkResponse = await this.pcloudClient.getfilelink(Number(dockerBlog.id.replace('f', '')));

		return this.contentRestClient.get<string>(fileLinkResponse);
	}
}
