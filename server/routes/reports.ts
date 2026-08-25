import { RequestHandler } from "express";
import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://hwglhastcmqgrvvxmaae.supabase.co';
  let supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseServiceKey) {
    supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3Z2xoYXN0Y21xZ3J2dnhtYWFlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzcwMzM3OCwiZXhwIjoyMDg5Mjc5Mzc4fQ.d7Hp-2bpZqvB673ZGE09Eii-BJSo5SZfZvlVSDn5uBc';
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase configuration in server environment");
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}

interface Report {
  id: string;
  user_id: string;
  title: string;
  content: string;
  patrol: string | null;
  activity: string | null;
  pdf_url: string | null;
  created_at: string;
}

export const getReports: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[ERROR] Supabase error:", error);
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json(data || []);
  } catch (error) {
    console.error("[ERROR] Failed to fetch reports:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
