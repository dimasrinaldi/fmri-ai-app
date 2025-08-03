import { Cache } from "file-system-cache";

const cache = new Cache({
    basePath: "./.cache", // (optional) Path where cache files are stored (default).
    ns: "app-cache", // (optional) A grouping namespace for items.
    hash: "sha1", // (optional) A hashing algorithm used within the cache key.
    ttl: 1, // (optional) A time-to-live (in secs) on how long an item remains cached.
});
type TInput = string[];
export const utilCache = {
    raw: cache,
    get<K>(key: TInput, defaultValue: K): Promise<K> {
        return cache.get(JSON.stringify(key), defaultValue);
    },
    set(key: TInput, value: any, ttl: number = 1) {
        cache.set(JSON.stringify(key), value, ttl);
    },
    async wrap<K>(
        key: TInput,
        fn: () => Promise<{ cached: boolean; value: K }>,
        ttl: number = 60
    ): Promise<K> {
        const test = await utilCache.get(key, undefined as any);
        if (ttl > 0 && test) {
            return test;
        }
        const exec = await fn();
        if (ttl > 0 && exec.cached) {
            utilCache.set(key, exec.value, ttl);
        }
        return exec.value;
    },
};
