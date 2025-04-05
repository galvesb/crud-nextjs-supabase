import { Person } from '@/types/person';
import { supabase } from '@/lib/supabase';

class CacheService {
  private static instance: CacheService;
  private cache: Person[] = [];
  private totalCount: number = 0;
  private lastFetch: number = 0;

  private constructor() {}

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  async getPeople(): Promise<Person[]> {
    return this.cache;
  }

  async getTotalCount(): Promise<number> {
    return this.totalCount;
  }

  async fetchAndUpdateCache(): Promise<Person[]> {
    const { data, error } = await supabase
      .from('people')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching people:', error);
      return this.cache;
    }

    this.cache = data || [];
    this.totalCount = this.cache.length;
    this.lastFetch = Date.now();
    return this.cache;
  }

  invalidateCache() {
    this.lastFetch = 0;
  }
}

export const cacheService = CacheService.getInstance();
