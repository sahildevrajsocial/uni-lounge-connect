import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Calendar, MapPin, Users, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasRSVPd, setHasRSVPd] = useState(false);

  useEffect(() => {
    fetchEvent();
    if (user) {
      checkRSVP();
    }
  }, [id, user]);

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          profiles(full_name, username)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setEvent(data);
    } catch (error: any) {
      toast({ title: "Error loading event", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const checkRSVP = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('event_rsvps')
      .select('id')
      .eq('event_id', id)
      .eq('user_id', user.id)
      .single();

    setHasRSVPd(!!data);
  };

  const handleRSVP = async () => {
    if (!user) {
      toast({ title: "Please sign in to RSVP" });
      navigate('/auth');
      return;
    }

    if (hasRSVPd) {
      const { error } = await supabase
        .from('event_rsvps')
        .delete()
        .eq('event_id', id)
        .eq('user_id', user.id);

      if (error) {
        toast({ title: "Error removing RSVP", description: error.message, variant: "destructive" });
      } else {
        setHasRSVPd(false);
        toast({ title: "RSVP removed" });
        fetchEvent();
      }
    } else {
      if (event.max_attendees && event.current_attendees >= event.max_attendees) {
        toast({ title: "Event is full", variant: "destructive" });
        return;
      }

      const { error } = await supabase
        .from('event_rsvps')
        .insert({ event_id: id, user_id: user.id });

      if (error) {
        toast({ title: "Error adding RSVP", description: error.message, variant: "destructive" });
      } else {
        setHasRSVPd(true);
        toast({ title: "RSVP confirmed!" });
        fetchEvent();
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Event not found</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="text-3xl">{event.title}</CardTitle>
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{event.profiles?.full_name || event.profiles?.username}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(event.event_date), 'PPP p')}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {event.tags && event.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {event.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary">{tag}</Badge>
                ))}
              </div>
            )}

            {event.description && (
              <div>
                <span className="text-sm font-semibold text-muted-foreground">Description:</span>
                <p className="text-foreground mt-2 whitespace-pre-wrap">{event.description}</p>
              </div>
            )}

            {event.location && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <span className="text-sm font-semibold text-muted-foreground">Location:</span>
                  <p className="text-foreground mt-1">{event.location}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 pt-4 border-t border-border">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {event.current_attendees || 0}
                {event.max_attendees && ` / ${event.max_attendees}`} attendees
              </span>
            </div>

            <Button 
              onClick={handleRSVP}
              variant={hasRSVPd ? "outline" : "default"}
              className="w-full"
            >
              {hasRSVPd ? "Cancel RSVP" : "RSVP to Event"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
