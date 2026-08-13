import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Post, Review, Vehicle } from "./types";

async function fetchWithTimeout<T>(fn: () => Promise<T>, fallback: T, ms = 15000): Promise<T> {
  let timeoutId: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("Database query timed out")), ms);
  });
  try {
    const result = await Promise.race([fn(), timeoutPromise]);
    clearTimeout(timeoutId);
    return result;
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn("Supabase query error:", err);
    return fallback;
  }
}

export const vehiclesQuery = queryOptions({
  queryKey: ["vehicles"],
  staleTime: 1000 * 30,
  gcTime: 1000 * 60 * 60,
  queryFn: async (): Promise<Vehicle[]> => {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      console.error("Error fetching vehicles:", error);
      throw error;
    }
    return (data ?? []) as unknown as Vehicle[];
  },
});

export const vehicleQuery = (slug: string) =>
  queryOptions({
    queryKey: ["vehicle", slug],
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 60,
    queryFn: async (): Promise<Vehicle | null> => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) {
        console.error("Error fetching vehicle:", error);
        throw error;
      }
      return (data ?? null) as unknown as Vehicle | null;
    },
  });

export const postsQuery = queryOptions({
  queryKey: ["posts"],
  staleTime: 1000 * 30,
  gcTime: 1000 * 60 * 60,
  queryFn: async (): Promise<Post[]> => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("published_at", { ascending: false });
    if (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
    return (data ?? []) as unknown as Post[];
  },
});

export const postQuery = (slug: string) =>
  queryOptions({
    queryKey: ["post", slug],
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 60,
    queryFn: async (): Promise<Post | null> => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) {
        console.error("Error fetching post:", error);
        throw error;
      }
      return (data ?? null) as unknown as Post | null;
    },
  });

export const reviewsQuery = queryOptions({
  queryKey: ["reviews"],
  staleTime: 1000 * 30,
  gcTime: 1000 * 60 * 60,
  queryFn: async (): Promise<Review[]> => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
    return (data ?? []) as unknown as Review[];
  },
});
