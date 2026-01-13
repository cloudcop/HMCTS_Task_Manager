import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ippshdkaouoahqomjbgb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwcHNoZGthb3VvYWhxb21qYmdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyNTExMjQsImV4cCI6MjA4MzgyNzEyNH0.2fBTgnI6NowQNxW1HUuJciaU2lfmBb22Los0n0WlLL4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);