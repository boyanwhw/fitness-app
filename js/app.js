import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://jjjswvzyknfyggsdtcym.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqanN3dnp5a25meWdnc2R0Y3ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4ODQ4NzIsImV4cCI6MjA5NTQ2MDg3Mn0.KEK_jclm2prQ56LR6R_Aan4G6trK4KXaO7DebB-1k';

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
