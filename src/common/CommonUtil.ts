
export class CommonUtil {
	private constructor() {
		// to avoid instantiation
	}
	
	public static getFileLinkCacheKey(fileName: string): string {
		return `file_link_${fileName}`;
	}
}
