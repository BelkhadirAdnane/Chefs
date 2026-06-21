import { RequestHandler } from "express";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase configuration in server environment");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

interface CreateSessionRequest {
  user_id: string;
  title: string;
  location: string;
  start_date: string;
  category?: string;
  objective?: string;
  method?: string;
  images?: string[];
}

export const createSession: RequestHandler = async (req, res) => {
  try {
    const {
      user_id,
      title,
      location,
      start_date,
      category,
      objective,
      method,
      images,
    }: CreateSessionRequest = req.body;

    // Validate required fields
    if (!user_id || !title || !location || !start_date) {
      return res.status(400).json({
        error: "Missing required fields: user_id, title, location, start_date",
      });
    }

    // Prepare description JSON with 5W details
    const description = JSON.stringify({
      category: category || "",
      objective: objective || "",
      method: method || "",
      images: images || [],
    });

    const { data, error } = await supabase
      .from("sessions")
      .insert({
        user_id,
        title,
        location,
        start_date,
        description,
        responsible: "Chef",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("[ERROR] Supabase error:", error);
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error("[ERROR] Failed to create session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
