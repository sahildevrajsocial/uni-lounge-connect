import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const usePresence = () => {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  const [presences, setPresences] = useState<any>({});

  useEffect(() => {
    if (!user) return;

    const channel = supabase.channel('online-users');

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setPresences(state);
        // Count unique users
        const count = Object.keys(state).length;
        setOnlineUsers(count);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('User joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('User left:', leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: user.id,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      channel.untrack();
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { onlineUsers, presences };
};
