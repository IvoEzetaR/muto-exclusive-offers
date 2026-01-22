
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gwgegdbrfaiosifepuzw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3Z2VnZGJyZmFpb3NpZmVwdXp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMTM4NjIsImV4cCI6MjA4NDY4OTg2Mn0.LFH8eaEV_Xmlj9FdZg40NEVHDvelK8ZFOhfeZKXvnWc';

export const supabase = createClient(supabaseUrl, supabaseKey);
