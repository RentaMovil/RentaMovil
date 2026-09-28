import Constants from 'expo-constants';
import { createClient } from '@supabase/supabase-js';

const expoExtra = (Constants.expoConfig && (Constants.expoConfig.extra as any)) || {};
const SUPABASE_URL =
	expoExtra.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY =
	expoExtra.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
	// eslint-disable-next-line no-console
	console.warn('Supabase: falta SUPABASE_URL o SUPABASE_ANON_KEY. Añade las claves en app.json (expo.extra) o en variables de entorno.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
