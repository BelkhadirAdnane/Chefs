import { RequestHandler } from "express";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto-js";

function getSupabaseClient() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log("[DEBUG] getSupabaseClient - VITE_SUPABASE_URL:", process.env.VITE_SUPABASE_URL ? "SET" : "NOT SET");
  console.log("[DEBUG] getSupabaseClient - SUPABASE_URL:", process.env.SUPABASE_URL ? "SET" : "NOT SET");
  console.log("[DEBUG] getSupabaseClient - SUPABASE_SERVICE_ROLE_KEY:", supabaseServiceKey ? "SET" : "NOT SET");

  if (!supabaseUrl || !supabaseServiceKey) {
    const errorMsg = `Missing Supabase configuration. URL: ${supabaseUrl ? 'SET' : 'NOT SET'}, Key: ${supabaseServiceKey ? 'SET' : 'NOT SET'}`;
    console.error("[ERROR]", errorMsg);
    throw new Error(errorMsg);
  }

  try {
    const client = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });
    console.log("[DEBUG] Supabase client created successfully");
    return client;
  } catch (err) {
    console.error("[ERROR] Failed to create Supabase client:", err);
    throw err;
  }
}

interface LoginRequest {
  cin: string;
  password: string;
}

interface LoginResponse {
  id: string;
  cin: string;
  first_name: string;
  last_name: string;
}

function hashPassword(password: string): string {
  return crypto.SHA256(password).toString();
}

export const loginChef: RequestHandler = async (req, res) => {
  try {
    console.log("[DEBUG] Login endpoint called");
    const { cin, password }: LoginRequest = req.body;

    if (!cin || !password) {
      console.log("[DEBUG] Missing CIN or password");
      return res.status(400).json({ error: "CIN and password are required" });
    }

    const trimmedCin = cin.trim();
    console.log("[DEBUG] Login attempt for CIN:", trimmedCin);
    console.log("[DEBUG] Hashing password...");

    let passwordHash: string;
    try {
      passwordHash = hashPassword(password);
      console.log("[DEBUG] Password hashed successfully");
    } catch (hashErr) {
      console.error("[ERROR] Password hashing failed:", hashErr);
      return res.status(500).json({ error: "Password processing error" });
    }

    console.log("[DEBUG] Creating Supabase client...");
    let supabase;
    try {
      supabase = getSupabaseClient();
      console.log("[DEBUG] Supabase client created");
    } catch (clientErr) {
      console.error("[ERROR] Failed to create Supabase client:", clientErr);
      return res.status(500).json({ error: "Database connection error" });
    }

    console.log("[DEBUG] Querying database for chef...");
    try {
      const { data: chef, error } = await supabase
        .from("user_chefs")
        .select("*")
        .eq("cin", trimmedCin)
        .maybeSingle();

      if (error) {
        console.error("[ERROR] Supabase query error:", error);
        return res.status(401).json({ error: "CIN or password incorrect" });
      }

      if (!chef) {
        console.log("[DEBUG] Chef not found with CIN:", trimmedCin);
        return res.status(401).json({ error: "CIN or password incorrect" });
      }

      console.log("[DEBUG] Chef found, verifying password");
      if (chef.password_hash !== passwordHash) {
        console.log("[ERROR] Password mismatch");
        return res.status(401).json({ error: "CIN or password incorrect" });
      }

      const response: LoginResponse = {
        id: chef.id,
        cin: chef.cin,
        first_name: chef.first_name,
        last_name: chef.last_name,
      };

      console.log("[DEBUG] Login successful for chef:", response.first_name);
      res.status(200).json(response);
    } catch (queryErr) {
      console.error("[ERROR] Database query exception:", queryErr);
      return res.status(500).json({ error: "Database error" });
    }
  } catch (error) {
    console.error("[ERROR] Login handler exception:", error instanceof Error ? error.message : String(error));
    res.status(500).json({ error: "Internal server error" });
  }
};
