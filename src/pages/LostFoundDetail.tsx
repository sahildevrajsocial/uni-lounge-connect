import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowLeft, User, Calendar, MapPin, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function LostFoundDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const { data, error } = await supabase
        .from('lost_found')
        .select(`
          *,
          profiles(full_name, username)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setItem(data);
    } catch (error: any) {
      toast({ title: "Error loading item", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Item not found</p>
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
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant={item.type === 'found' ? 'default' : 'destructive'}>
                {item.type === 'found' ? 'Found' : 'Lost'}
              </Badge>
              <Badge variant={item.status === 'solved' ? 'secondary' : 'outline'}>
                {item.status === 'solved' ? '✓ Solved' : 'Active'}
              </Badge>
            </div>
            <CardTitle className="text-3xl">{item.title}</CardTitle>
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{item.profiles?.full_name || item.profiles?.username}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(item.created_at), 'PPP')}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {item.image_url && (
              <div 
                className="w-full rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-smooth border border-border"
                onClick={() => setImageDialogOpen(true)}
              >
                <img 
                  src={item.image_url} 
                  alt={item.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {item.description && (
              <div>
                <span className="text-sm font-semibold text-muted-foreground">Description:</span>
                <p className="text-foreground mt-2 whitespace-pre-wrap">{item.description}</p>
              </div>
            )}

            {item.location && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <span className="text-sm font-semibold text-muted-foreground">Location:</span>
                  <p className="text-foreground mt-1">{item.location}</p>
                </div>
              </div>
            )}

            {item.contact_info && (
              <div className="flex items-start gap-2 pt-4 border-t border-border">
                <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <span className="text-sm font-semibold text-muted-foreground">Contact:</span>
                  <p className="text-foreground mt-1">{item.contact_info}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
          <DialogContent className="max-w-4xl">
            <img src={item.image_url} alt={item.title} className="w-full h-auto" />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
