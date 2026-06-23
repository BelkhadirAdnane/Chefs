import { RequestHandler } from "express";
import { createClient } from "@supabase/supabase-js";
import * as CryptoJS from "crypto-js";

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
  return CryptoJS.SHA256(password).toString();
}

export const loginChef: RequestHandler = async (req, res) => {
  try {
    const { cin, password }: LoginRequest = req.body;

    if (!cin || !password) {
      return res.status(400).json({ error: "CIN and password are required" });
    }

    try {
      const supabase = getSupabaseClient();
      const passwordHash = hashPassword(password);
      const trimmedCin = cin.trim();

      console.log("[DEBUG] Login attempt for CIN:", trimmedCin);
      console.log("[DEBUG] Supabase URL configured:", !!process.env.SUPABASE_URL);
      console.log("[DEBUG] Service role key configured:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);

      const { data: chef, error } = await supabase
        .from("user_chefs")
        .select("*")
        .eq("cin", trimmedCin)
        .maybeSingle();

      if (error) {
        console.error("[ERROR] Supabase error:", error);
        return res.status(400).json({ error: "CIN or password incorrect" });
      }

      if (!chef) {
        console.log("[DEBUG] Chef not found with CIN:", trimmedCin);
        return res.status(401).json({ error: "CIN or password incorrect" });
      }

      if (chef.password_hash !== passwordHash) {
        console.log("[ERROR] Password mismatch for chef:", chef.cin);
        return res.status(401).json({ error: "CIN or password incorrect" });
      }

      const response: LoginResponse = {
        id: chef.id,
        cin: chef.cin,
        first_name: chef.first_name,
        last_name: chef.last_name,
      };

      console.log("[DEBUG] Login successful for chef:", response.first_name, response.last_name);
      res.status(200).json(response);
    } catch (supabaseError) {
      console.error("[ERROR] Supabase client error:", supabaseError);
      res.status(500).json({ error: "Internal server error" });
    }
  } catch (error) {
    console.error("[ERROR] Login failed with exception:", error instanceof Error ? error.message : String(error));
    res.status(500).json({ error: "Internal server error" });
  }
};
