import { Inject, Injectable, ProviderScope, ProviderType } from "@tsed/common";
import { REDIS_CONNECTION } from "../config/RedisConnection";

export type CacheValue = string | number | Record<string, string | number>

@Injectable({
	type: ProviderType.SERVICE,
	scope: ProviderScope.SINGLETON
})
export class CacheService {

	@Inject(REDIS_CONNECTION)
	protected connection: REDIS_CONNECTION;
	static DEFAULT_TTL_IN_SECONDS = 3600;

	public async store(key: string, value: CacheValue, ttlInSeconds?: number): Promise<void> {
		await this.connection.set(key, JSON.stringify(value), "EX", ttlInSeconds || CacheService.DEFAULT_TTL_IN_SECONDS);
	}

	public async retrieve<T>(key: string): Promise<T | null> {
		const rawValue = await this.connection.get(key);

		return rawValue ? JSON.parse(rawValue) as T : null;
	}
}