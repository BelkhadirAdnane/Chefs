import { supabase } from './supabase';
import crypto from 'crypto-js';

// Simple password hashing (in production, use bcrypt on backend)
export function hashPassword(password: string): string {
  return crypto.SHA256(password).toString();
}

export async function registerChef(data: {
  cin: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  can: string;
  phone: string;
  password: string;
}) {
  try {
    const passwordHash = hashPassword(data.password);
    const cin = data.cin.trim();
    const firstName = data.firstName.trim();
    const lastName = data.lastName.trim();
    const can = data.can.trim();
    const phone = data.phone.trim();

    // Check if CIN already exists
    const { data: existing, error: checkError } = await supabase
      .from('user_chefs')
      .select('cin')
      .eq('cin', cin)
      .single();

    if (existing) {
      return {
        error: 'Ce numéro CIN est déjà enregistré',
        data: null,
      };
    }

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 = no rows returned (which is good)
      throw checkError;
    }

    // Insert new chef
    const { data: newChef, error } = await supabase
      .from('user_chefs')
      .insert({
        cin,
        first_name: firstName,
        last_name: lastName,
        date_of_birth: data.dateOfBirth || null,
        can,
        phone,
        password_hash: passwordHash,
      })
      .select()
      .single();

    if (error) {
      return {
        error: error.message || 'Erreur lors de l\'inscription',
        data: null,
      };
    }

    return {
      error: null,
      data: newChef,
    };
  } catch (err) {
    console.error('Registration error:', err);
    return {
      error: 'Erreur lors de l\'inscription',
      data: null,
    };
  }
}

export async function loginChef(cin: string, password: string) {
  try {
    const trimmedCin = cin.trim();

    console.log('[DEBUG] loginChef: Tentative de connexion via API');
    console.log('[DEBUG] CIN saisi:', `"${cin}"`, '| CIN trimé:', `"${trimmedCin}"`);

    // Use API endpoint instead of direct Supabase query (bypasses RLS)
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cin: trimmedCin,
        password: password,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.log('[ERROR] Login error:', result.error);
      return {
        error: result.error || 'CIN ou mot de passe incorrect',
        data: null,
      };
    }

    console.log('[DEBUG] Authentification réussie! Chef:', result.first_name, result.last_name);
    console.log('[DEBUG] Création de la session...');

    // Store session
    const sessionData = {
      id: result.id,
      cin: result.cin,
      firstName: result.first_name,
      lastName: result.last_name,
    };

    localStorage.setItem('chef_session', JSON.stringify(sessionData));
    console.log('[DEBUG] Session stockée');

    return {
      error: null,
      data: result,
    };
  } catch (err) {
    console.error('[ERROR] Exception dans loginChef:', err);
    return {
      error: 'Erreur lors de la connexion',
      data: null,
    };
  }
}

export function logoutChef() {
  localStorage.removeItem('chef_session');
  localStorage.removeItem('user');
}

export function getCurrentChef() {
  const session = localStorage.getItem('chef_session');
  if (session) {
    try {
      return JSON.parse(session);
    } catch {
      return null;
    }
  }
  return null;
}

export function isChefLoggedIn(): boolean {
  return !!getCurrentChef();
}
