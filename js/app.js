import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://hkkqhotxdvxnahckrqrc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhra3Fob3R4ZHZ4bmFoY2tycXJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4ODczMzEsImV4cCI6MjA5NTQ2MzMzMX0.7Te2sjNXj6dkWBaWh_K-GQXp1FDn02MbnouClIDgqeQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkAuth() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

async function signOut() {
  await supabase.auth.signOut();
  window.location.href = 'login.html';
}

async function requireAuth() {
  const user = await checkAuth();
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }
  return user;
}

export { supabase, checkAuth, signOut, requireAuth };
