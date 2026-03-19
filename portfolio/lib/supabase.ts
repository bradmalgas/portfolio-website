import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function getPublicConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return { supabaseUrl, supabaseAnonKey };
}

function createPublicClient() {
  const { supabaseUrl, supabaseAnonKey } = getPublicConfig();

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

let publicClient: SupabaseClient | null = null;

function getSupabaseClient() {
  if (publicClient) {
    return publicClient;
  }

  publicClient = createPublicClient();
  return publicClient;
}

function createLazyClientProxy(getClient: () => SupabaseClient) {
  return new Proxy({} as SupabaseClient, {
    get(_target, property, receiver) {
      const client = getClient();
      const value = Reflect.get(client, property, receiver);

      if (typeof value === "function") {
        return value.bind(client);
      }

      return value;
    },
  });
}

export const supabase = createLazyClientProxy(getSupabaseClient);

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("The Supabase admin client is server-only.");
  }

  if (adminClient) {
    return adminClient;
  }

  const { supabaseUrl } = getPublicConfig();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }

  adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return adminClient;
}
