import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Eye, User, Calendar, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNote();
  }, [id]);

  const fetchNote = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select(`
          *,
          profiles(full_name, username)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setNote(data);
    } catch (error: any) {
      toast({ title: "Error loading note", description: error.message, variant: "destructive" });
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

  if (!note) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Note not found</p>
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
            <CardTitle className="text-3xl">{note.title}</CardTitle>
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{note.profiles?.full_name || note.profiles?.username}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(note.created_at), 'PPP')}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {note.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary">{tag}</Badge>
                ))}
              </div>
            )}

            {note.course && (
              <div>
                <span className="text-sm font-semibold text-muted-foreground">Course:</span>
                <p className="text-foreground mt-1">{note.course}</p>
              </div>
            )}

            {note.subject && (
              <div>
                <span className="text-sm font-semibold text-muted-foreground">Subject:</span>
                <p className="text-foreground mt-1">{note.subject}</p>
              </div>
            )}

            {note.semester && (
              <div>
                <span className="text-sm font-semibold text-muted-foreground">Semester:</span>
                <p className="text-foreground mt-1">{note.semester}</p>
              </div>
            )}

            {note.content && (
              <div>
                <span className="text-sm font-semibold text-muted-foreground">Content:</span>
                <p className="text-foreground mt-2 whitespace-pre-wrap">{note.content}</p>
              </div>
            )}

            <div className="flex gap-2 pt-4 border-t border-border">
              <Button 
                variant="default"
                onClick={() => {
                  if (note.file_url) {
                    window.open(note.file_url, '_blank');
                  } else {
                    toast({ title: "No file attached to this note" });
                  }
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                View File
              </Button>
              {note.file_url && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = note.file_url;
                    link.download = `${note.title}.${note.file_url.split('.').pop()}`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
            </div>

            <div className="flex gap-4 text-sm text-muted-foreground pt-4 border-t border-border">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{note.downloads || 0} downloads</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
