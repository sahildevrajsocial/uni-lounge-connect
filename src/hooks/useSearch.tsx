import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type ContentType = 'all' | 'notes' | 'events' | 'lost_found';

export interface SearchFilters {
  contentType: ContentType;
  // Notes filters
  subject?: string;
  course?: string;
  semester?: string;
  // Events filters
  eventDateFrom?: string;
  eventDateTo?: string;
  // Lost & Found filters
  lostFoundType?: 'lost' | 'found' | '';
  lostFoundStatus?: 'active' | 'resolved' | '';
  location?: string;
}

export interface SearchResult {
  id: string;
  type: 'note' | 'event' | 'lost_found';
  title: string;
  description?: string;
  content?: string;
  created_at: string;
  tags?: string[];
  [key: string]: any;
}

export const useSearch = (query: string, filters: SearchFilters) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchContent = async () => {
      if (!query.trim() && filters.contentType === 'all') {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const allResults: SearchResult[] = [];

        // Search Notes
        if (filters.contentType === 'all' || filters.contentType === 'notes') {
          let notesQuery = supabase
            .from('notes')
            .select('*')
            .or(`title.ilike.%${query}%,content.ilike.%${query}%,subject.ilike.%${query}%,course.ilike.%${query}%`);

          if (filters.subject) {
            notesQuery = notesQuery.ilike('subject', `%${filters.subject}%`);
          }
          if (filters.course) {
            notesQuery = notesQuery.ilike('course', `%${filters.course}%`);
          }
          if (filters.semester) {
            notesQuery = notesQuery.ilike('semester', `%${filters.semester}%`);
          }

          const { data: notes } = await notesQuery.order('created_at', { ascending: false });
          
          if (notes) {
            allResults.push(
              ...notes.map((note) => ({
                ...note,
                type: 'note' as const,
                description: note.content,
              }))
            );
          }
        }

        // Search Events
        if (filters.contentType === 'all' || filters.contentType === 'events') {
          let eventsQuery = supabase
            .from('events')
            .select('*')
            .or(`title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`);

          if (filters.eventDateFrom) {
            eventsQuery = eventsQuery.gte('event_date', filters.eventDateFrom);
          }
          if (filters.eventDateTo) {
            eventsQuery = eventsQuery.lte('event_date', filters.eventDateTo);
          }

          const { data: events } = await eventsQuery.order('event_date', { ascending: true });
          
          if (events) {
            allResults.push(
              ...events.map((event) => ({
                ...event,
                type: 'event' as const,
              }))
            );
          }
        }

        // Search Lost & Found
        if (filters.contentType === 'all' || filters.contentType === 'lost_found') {
          let lostFoundQuery = supabase
            .from('lost_found')
            .select('*')
            .or(`title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`);

          if (filters.lostFoundType) {
            lostFoundQuery = lostFoundQuery.eq('type', filters.lostFoundType);
          }
          if (filters.lostFoundStatus) {
            lostFoundQuery = lostFoundQuery.eq('status', filters.lostFoundStatus);
          }
          if (filters.location) {
            lostFoundQuery = lostFoundQuery.ilike('location', `%${filters.location}%`);
          }

          const { data: lostFound } = await lostFoundQuery.order('created_at', { ascending: false });
          
          if (lostFound) {
            allResults.push(
              ...lostFound.map((item) => ({
                ...item,
                type: 'lost_found' as const,
              }))
            );
          }
        }

        setResults(allResults);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    searchContent();
  }, [query, filters]);

  return { results, isLoading };
};
