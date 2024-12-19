import { createClient } from '@supabase/supabase-js';

    const supabaseUrl = 'https://stnprsqyiwgcbfkzrcyi.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0bnByc3F5aXdnY2Jma3pyY3lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwMTcyNzMsImV4cCI6MjA0OTU5MzI3M30.2eAcd7ZT7EazdRniFxByCTmI5RYdjZmZ1VRxsJzLk2U';

    export const supabase = createClient(supabaseUrl, supabaseKey);

    export const getUserSpaces = async () => {
      const { data, error } = await supabase
        .from('user_spaces')
        .select('*')
        .eq('user_id', supabase.auth.user()?.id);

      if (error) {
        console.error('Error fetching user spaces:', error);
        return [];
      }
      return data;
    };

    export const createUserSpace = async (name) => {
      const { data, error } = await supabase
        .from('user_spaces')
        .insert([{ name, user_id: supabase.auth.user()?.id }])
        .select();

      if (error) {
        console.error('Error creating user space:', error);
        return null;
      }
      return data[0];
    };
