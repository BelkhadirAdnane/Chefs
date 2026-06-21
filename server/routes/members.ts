import { RequestHandler } from "express";
import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase configuration in server environment");
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}

interface Member {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  branch: string | null;
  patrol: string | null;
  role: string | null;
  tutor_name: string | null;
  tutor_phone: string | null;
  created_at: string;
}

export const getMembers: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[ERROR] Supabase error:", error);
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json(data || []);
  } catch (error) {
    console.error("[ERROR] Failed to fetch members:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
