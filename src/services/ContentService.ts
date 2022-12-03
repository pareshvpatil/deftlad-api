import { $log, Inject, Injectable, ProviderScope, ProviderType } from "@tsed/common";
import axios, { AxiosInstance } from "axios";
import pcloudSdk, { Client } from "pcloud-sdk-js";
import { CommonUtil } from "../common/CommonUtil";
import { envs } from "../config/envs";
import { IBlogInfo } from "../models/IBlogInfo";
import { CacheService } from "./CacheService";

export enum PageType {
	blog = "blog",
	project = "project"
}

@Injectable({
	type: ProviderType.SERVICE,
	scope: ProviderScope.SINGLETON
})
export class ContentService {

	private readonly pCloudClient: Client;
	private readonly contentRestClient: AxiosInstance;

	private static readonly METADATA_LOOKUP: Record<PageType, { fileName: string; cacheKey: string; folderId: number; }> = {
		[PageType.blog]: {
			fileName: envs.pCloud.blogsMetadataFile,
			cacheKey: CommonUtil.getFileLinkCacheKey(envs.pCloud.blogsMetadataFile),
			folderId: envs.pCloud.blogsFolderId
		},
		[PageType.project]: {
			fileName: envs.pCloud.projectsMetadataFile,
			cacheKey: CommonUtil.getFileLinkCacheKey(envs.pCloud.projectsMetadataFile),
			folderId: envs.pCloud.projectsFolderId
		}
	}

	@Inject()
	private readonly cacheService: CacheService;

	constructor() {
		this.pCloudClient = pcloudSdk.createClient(envs.PCLOUD_API_KEY);
		this.contentRestClient = axios.create({
			timeout: 6000
		});
	}

	public async listBlogs(): Promise<IBlogInfo[]> {
		const response: any = await this.pCloudClient.listfolder(envs.pCloud.blogsFolderId);
		return response.contents as any;
	}

	public async listProjects(): Promise<IBlogInfo[]> {
		const response: any = await this.pCloudClient.listfolder(envs.pCloud.projectsFolderId);
		return response.contents as any;
	}

	public async getFileInformation(pageType: PageType, fileName: string): Promise<any | null> {
		const folderId = ContentService.METADATA_LOOKUP[pageType].folderId;
		return this.getFileInfo(folderId, fileName);
	}

	public async listRecentBlogs(): Promise<IBlogInfo[]> {
		const response = await this.listBlogs();

		(response as any[]).sort((file1, file2) => (new Date(file2.created).getTime() - (new Date(file1.created)).getTime()));

		return (response as any[]).slice(0, 3);
	}

	public async listRecentProjects(): Promise<IBlogInfo[]> {
		const response = await this.listProjects();

		(response as any[]).sort((file1, file2) => (new Date(file2.created).getTime() - (new Date(file1.created)).getTime()));

		return (response as any[]).slice(0, 3);
	}

	public async getPageMetadata(pageType: PageType): Promise<string | null> {
		const folderId = envs.pCloud.metadataFolderId;
		const fileName = ContentService.METADATA_LOOKUP[pageType].fileName;
		const cacheKey = ContentService.METADATA_LOOKUP[pageType].cacheKey;

		return this.getFileContentFromStorage(folderId, fileName, cacheKey);
	}

	private async getFileContentFromStorage(folderId: number, fileName: string, cacheKey: string): Promise<string | null> {
		const cachedLink = await this.cacheService.retrieve<string>(cacheKey);

		if (!cachedLink) {
			return this.getFileContentFromStorageNoCache(folderId, fileName, cacheKey);
		}

		$log.info(`found cached file link for key: ${cacheKey}, file link: ${cachedLink}`);

		const content = await this.getFileContentFromLink(cachedLink);
		
		if (!content) {
			return this.getFileContentFromStorageNoCache(folderId, fileName, cacheKey);
		}

		return content;
	}

	private async getFileContentFromStorageNoCache(folderId: number, fileName: string, cacheKey: string): Promise<string | null> {
		const metadataFileInfo = await this.getFileInfo(folderId, fileName);
		const fileLink = await this.pCloudClient.getfilelink(metadataFileInfo.fileid);
		await this.cacheService.store(cacheKey, fileLink);

		return this.getFileContentFromLink(fileLink);
	}

	private async getFileInfo(folderId: number, fileName: string): Promise<any | null> {
		const response: any = await this.pCloudClient.listfolder(folderId);
		const metadataFileInfo = (response.contents as any[]).find(file => file.name === fileName);
		return metadataFileInfo;
	}

	private async getFileContentFromLink(fileLink: string): Promise<string | null> {
		try {
			const response = await this.contentRestClient.get<string>(fileLink);
			return response.data;
		} catch (e) {
			$log.error('Failed to get file content, links needs to be recreated...');
			return Promise.resolve(null);
		}
	}

	public async getContent(pageType: PageType, fileName: string): Promise<string | null> {
		const folderId = ContentService.METADATA_LOOKUP[pageType].folderId;
		const fileInfo = await this.getFileInfo(folderId, fileName);

		return this.getFileContentFromStorage(folderId, fileInfo.name, CommonUtil.getFileLinkCacheKey(fileInfo.name));
	}
}
