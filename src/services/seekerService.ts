import { supabase } from '../lib/supabase';
import { Property } from '../types/property';
import { mapDbPropertyToProperty } from './propertyService';

export interface SeekerSearch {
  id: string;
  query: string;
  resultCount: number;
  createdAt: Date;
}

export interface AreaInsight {
  name: string;
  propertyCount: number;
  avgPrice: number;
  popularType: string;
}

export async function fetchLiveListings(limit = 24): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*, property_images (*)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map((row) =>
    mapDbPropertyToProperty(row, Array.isArray(row.property_images) ? row.property_images : [])
  );
}

export async function countLiveListingsForQuery(query: string): Promise<number> {
  const term = query.trim();
  if (!term) return 0;

  const { count, error } = await supabase
    .from('properties')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'active')
    .or(`title.ilike.%${term}%,address.ilike.%${term}%,city.ilike.%${term}%,lga.ilike.%${term}%,state.ilike.%${term}%`);

  if (error) return 0;
  return count || 0;
}

export async function fetchSeekerFavorites(userId: string): Promise<Property[]> {
  const { data, error } = await supabase
    .from('seeker_favorites')
    .select('property_id, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data?.length) return [];

  const ids = data.map((row) => row.property_id);
  const { data: listings, error: listingError } = await supabase
    .from('properties')
    .select('*, property_images (*)')
    .in('id', ids);

  if (listingError || !listings) return [];

  const byId = new Map(listings.map((row) => [row.id, row]));
  return ids
    .map((id) => byId.get(id))
    .filter(Boolean)
    .map((row) =>
      mapDbPropertyToProperty(row!, Array.isArray(row!.property_images) ? row!.property_images : [])
    );
}

export async function fetchSeekerSearches(userId: string): Promise<SeekerSearch[]> {
  const { data, error } = await supabase
    .from('seeker_searches')
    .select('id, query, result_count, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(8);

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    query: row.query,
    resultCount: Number(row.result_count || 0),
    createdAt: new Date(row.created_at),
  }));
}

export async function recordSeekerSearch(userId: string, query: string): Promise<SeekerSearch | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const resultCount = await countLiveListingsForQuery(trimmed);
  const { data, error } = await supabase
    .from('seeker_searches')
    .insert({
      user_id: userId,
      query: trimmed,
      result_count: resultCount,
    })
    .select('id, query, result_count, created_at')
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    query: data.query,
    resultCount: Number(data.result_count || 0),
    createdAt: new Date(data.created_at),
  };
}

export function buildAreaInsights(properties: Property[]): AreaInsight[] {
  const groups = new Map<string, Property[]>();

  properties.forEach((property) => {
    const name = property.location.city || property.location.state;
    if (!name) return;
    const list = groups.get(name) || [];
    list.push(property);
    groups.set(name, list);
  });

  return Array.from(groups.entries())
    .map(([name, list]) => {
      const typeCount = list.reduce((acc, property) => {
        acc[property.propertyType] = (acc[property.propertyType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const popularType =
        Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'apartment';
      const avgPrice = list.reduce((sum, property) => sum + (property.pricing.price || 0), 0) / list.length;

      return {
        name,
        propertyCount: list.length,
        avgPrice,
        popularType,
      };
    })
    .sort((a, b) => b.propertyCount - a.propertyCount);
}
