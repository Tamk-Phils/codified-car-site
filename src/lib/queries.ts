import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Post, Review, Vehicle } from "./types";

async function fetchWithTimeout<T>(fn: () => Promise<T>, fallback: T, ms = 6000): Promise<T> {
  return Promise.race([
    fn(),
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]).catch((err) => {
    console.warn("Supabase query timeout or error:", err);
    return fallback;
  });
}

export const vehiclesQuery = queryOptions({
  queryKey: ["vehicles"],
  staleTime: 1000 * 60 * 10,
  gcTime: 1000 * 60 * 60,
  queryFn: async (): Promise<Vehicle[]> => {
    return fetchWithTimeout(async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as Vehicle[];
    }, []);
  },
});

export const vehicleQuery = (slug: string) =>
  queryOptions({
    queryKey: ["vehicle", slug],
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
    queryFn: async (): Promise<Vehicle | null> => {
      return fetchWithTimeout(async () => {
        const { data, error } = await supabase
          .from("vehicles")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();
        if (error) throw error;
        return (data ?? null) as unknown as Vehicle | null;
      }, null);
    },
  });

export const postsQuery = queryOptions({
  queryKey: ["posts"],
  staleTime: 1000 * 60 * 10,
  gcTime: 1000 * 60 * 60,
  queryFn: async (): Promise<Post[]> => {
    return fetchWithTimeout(async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Post[];
    }, []);
  },
});

export const postQuery = (slug: string) =>
  queryOptions({
    queryKey: ["post", slug],
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
    queryFn: async (): Promise<Post | null> => {
      return fetchWithTimeout(async () => {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();
        if (error) throw error;
        return (data ?? null) as unknown as Post | null;
      }, null);
    },
  });

export const reviewsQuery = queryOptions({
  queryKey: ["reviews"],
  staleTime: 1000 * 60 * 10,
  gcTime: 1000 * 60 * 60,
  queryFn: async (): Promise<Review[]> => {
    return fetchWithTimeout(async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as Review[];
    }, []);
  },
});
