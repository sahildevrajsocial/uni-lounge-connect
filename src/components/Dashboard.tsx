import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, Search, Calendar, Trophy, Plus, TrendingUp, 
  Users, Star, MapPin, Clock, Download, Eye
} from "lucide-react";


const topContributors = [
  { name: "Sarah Johnson", points: 2340, contributions: 45, rank: 1 },
  { name: "Alex Chen", points: 2156, contributions: 38, rank: 2 },
  { name: "Maria Garcia", points: 1987, contributions: 42, rank: 3 }
];

export function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [isLostFoundDialogOpen, setIsLostFoundDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [notes, setNotes] = useState<any[]>([]);
  const [lostFoundItems, setLostFoundItems] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [notesResult, lostFoundResult, eventsResult] = await Promise.all([
        supabase.from('notes').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('lost_found').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('events').select('*').order('created_at', { ascending: false }).limit(10)
      ]);

      if (notesResult.data) setNotes(notesResult.data);
      if (lostFoundResult.data) setLostFoundItems(lostFoundResult.data);
      if (eventsResult.data) setEvents(eventsResult.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File, bucket: string) => {
    if (!user) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);
      
    if (error) {
      toast({ title: "File upload failed", description: error.message, variant: "destructive" });
      return null;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);
      
    return publicUrl;
  };

  const handleAddNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Please sign in to add notes", variant: "destructive" });
      return;
    }

    setUploading(true);
    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;
    
    let fileUrl = null;
    if (file && file.size > 0) {
      // Validate file type for notes (images, PDFs, Word docs)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({ title: "Invalid file type", description: "Please upload images, PDFs, or Word documents only", variant: "destructive" });
        setUploading(false);
        return;
      }
      
      fileUrl = await handleFileUpload(file, 'notes-files');
      if (!fileUrl) {
        setUploading(false);
        return;
      }
    }

    const { error } = await supabase.from('notes').insert({
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      subject: formData.get('subject') as string,
      course: formData.get('course') as string,
      semester: formData.get('semester') as string,
      file_url: fileUrl,
      user_id: user.id
    });

    setUploading(false);
    if (error) {
      toast({ title: "Error adding note", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Note added successfully!" });
      setIsNoteDialogOpen(false);
      e.currentTarget.reset();
      fetchData(); // Refresh data
    }
  };

  const handleReportItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Please sign in to report items", variant: "destructive" });
      return;
    }

    setUploading(true);
    const formData = new FormData(e.currentTarget);
    const file = formData.get('image') as File;
    const itemType = formData.get('type') as string;
    
    let imageUrl = null;
    // Only allow image uploads for "lost" items, not "found" items
    if (file && file.size > 0) {
      if (itemType === 'found') {
        toast({ title: "Images not allowed", description: "Image uploads are only allowed for lost items", variant: "destructive" });
        setUploading(false);
        return;
      }
      
      // Validate file type for lost items (images only)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast({ title: "Invalid file type", description: "Please upload images only", variant: "destructive" });
        setUploading(false);
        return;
      }
      
      imageUrl = await handleFileUpload(file, 'lost-found-images');
      if (!imageUrl) {
        setUploading(false);
        return;
      }
    }

    const { error } = await supabase.from('lost_found').insert({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      type: itemType,
      location: formData.get('location') as string,
      contact_info: formData.get('contact_info') as string,
      image_url: imageUrl,
      user_id: user.id
    });

    setUploading(false);
    if (error) {
      toast({ title: "Error reporting item", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Item reported successfully!" });
      setIsLostFoundDialogOpen(false);
      setSelectedType("");
      e.currentTarget.reset();
      fetchData(); // Refresh data
    }
  };

  const handleCreateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Please sign in to create events", variant: "destructive" });
      return;
    }

    const formData = new FormData(e.currentTarget);
    const { error } = await supabase.from('events').insert({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      location: formData.get('location') as string,
      event_date: formData.get('event_date') as string,
      max_attendees: parseInt(formData.get('max_attendees') as string) || null,
      user_id: user.id
    });

    if (error) {
      toast({ title: "Error creating event", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Event created successfully!" });
      setIsEventDialogOpen(false);
      e.currentTarget.reset();
      fetchData(); // Refresh data
    }
  };

  return (
    <section id="dashboard" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Campus <span className="text-primary">Dashboard</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Your personalized hub for all campus activities
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Notes Section */}
          <Card id="notes" className="lg:col-span-2 shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <CardTitle>Recent Study Materials</CardTitle>
              </div>
              <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-primary hover:bg-primary-dark">
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Notes
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Note</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddNote} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" name="title" required />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" name="subject" required />
                    </div>
                    <div>
                      <Label htmlFor="course">Course</Label>
                      <Input id="course" name="course" />
                    </div>
                    <div>
                      <Label htmlFor="semester">Semester</Label>
                      <Input id="semester" name="semester" />
                    </div>
                    <div>
                      <Label htmlFor="content">Content</Label>
                      <Textarea id="content" name="content" rows={4} />
                    </div>
                    <div>
                      <Label htmlFor="file">Upload File (Images, PDFs, Word docs)</Label>
                      <Input id="file" name="file" type="file" accept="image/*,.pdf,.doc,.docx" />
                    </div>
                    <Button type="submit" className="w-full" disabled={uploading}>
                      {uploading ? "Uploading..." : "Add Note"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center text-muted-foreground">Loading notes...</div>
              ) : notes.length === 0 ? (
                <div className="text-center text-muted-foreground">No notes uploaded yet</div>
              ) : (
                <div className="space-y-4">
                  {notes.map((note) => (
                    <div key={note.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{note.title}</h4>
                        <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                          {note.subject && <Badge variant="secondary">{note.subject}</Badge>}
                          {note.course && <span>{note.course}</span>}
                          <div className="flex items-center">
                            <Download className="h-3 w-3 mr-1" />
                            {note.downloads || 0}
                          </div>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                            {note.likes || 0}
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          if (note.file_url) {
                            window.open(note.file_url, '_blank');
                          } else {
                            toast({ title: "No file attached to this note" });
                          }
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-secondary" />
                  <span>Your Impact</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Points Earned</span>
                    <span className="font-bold text-secondary">1,234</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Notes Shared</span>
                    <span className="font-bold">23</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Items Helped Find</span>
                    <span className="font-bold">7</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Campus Rank</span>
                    <Badge className="bg-accent hover:bg-accent-light">#45</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-accent" />
                  <span>Active Now</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent mb-1">234</div>
                  <div className="text-sm text-muted-foreground">Students Online</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Lost & Found and Events Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Lost & Found */}
          <Card id="lost-found" className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-2">
                <Search className="h-5 w-5 text-accent" />
                <CardTitle>Lost & Found</CardTitle>
              </div>
              <Dialog open={isLostFoundDialogOpen} onOpenChange={setIsLostFoundDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-accent hover:bg-accent-light">
                    <Plus className="h-4 w-4 mr-2" />
                    Report Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Report Lost/Found Item</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleReportItem} className="space-y-4">
                    <div>
                      <Label htmlFor="item-title">Item Name</Label>
                      <Input id="item-title" name="title" required />
                    </div>
                    <div>
                      <Label htmlFor="item-type">Type</Label>
                      <Select name="type" required onValueChange={setSelectedType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lost">Lost</SelectItem>
                          <SelectItem value="found">Found</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="item-location">Location</Label>
                      <Input id="item-location" name="location" required />
                    </div>
                    <div>
                      <Label htmlFor="item-description">Description</Label>
                      <Textarea id="item-description" name="description" rows={3} />
                    </div>
                    <div>
                      <Label htmlFor="item-contact">Contact Info</Label>
                      <Input id="item-contact" name="contact_info" placeholder="Email or phone number" />
                    </div>
                    {selectedType === "lost" && (
                      <div>
                        <Label htmlFor="image">Upload Image (Lost items only)</Label>
                        <Input id="image" name="image" type="file" accept="image/*" />
                      </div>
                    )}
                    <Button type="submit" className="w-full" disabled={uploading}>
                      {uploading ? "Uploading..." : "Report Item"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center text-muted-foreground">Loading items...</div>
              ) : lostFoundItems.length === 0 ? (
                <div className="text-center text-muted-foreground">No items reported yet</div>
              ) : (
                <div className="space-y-3">
                  {lostFoundItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{item.location}</span>
                          <Clock className="h-3 w-3" />
                          <span>{new Date(item.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Badge variant={item.type === 'found' ? 'default' : 'destructive'}>
                        {item.type === 'found' ? 'Found' : 'Lost'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Events */}
          <Card id="events" className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-secondary" />
                <CardTitle>Upcoming Events</CardTitle>
              </div>
              <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-secondary hover:bg-secondary-light">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateEvent} className="space-y-4">
                    <div>
                      <Label htmlFor="event-title">Event Title</Label>
                      <Input id="event-title" name="title" required />
                    </div>
                    <div>
                      <Label htmlFor="event-description">Description</Label>
                      <Textarea id="event-description" name="description" rows={3} />
                    </div>
                    <div>
                      <Label htmlFor="event-location">Location</Label>
                      <Input id="event-location" name="location" required />
                    </div>
                    <div>
                      <Label htmlFor="event-date">Event Date & Time</Label>
                      <Input id="event-date" name="event_date" type="datetime-local" required />
                    </div>
                    <div>
                      <Label htmlFor="event-attendees">Max Attendees (optional)</Label>
                      <Input id="event-attendees" name="max_attendees" type="number" min="1" />
                    </div>
                    <Button type="submit" className="w-full">Create Event</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center text-muted-foreground">Loading events...</div>
              ) : events.length === 0 ? (
                <div className="text-center text-muted-foreground">No events created yet</div>
              ) : (
                <div className="space-y-3">
                  {events.map((event) => (
                    <div key={event.id} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{event.title}</h4>
                        <Badge variant="outline">Event</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{event.location}</span>
                        <div className="flex items-center space-x-3">
                          <span>{new Date(event.event_date).toLocaleDateString()}</span>
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {event.current_attendees || 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard */}
        <Card id="leaderboard" className="mt-8 shadow-soft">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-warning" />
              <CardTitle>Top Contributors This Week</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topContributors.map((contributor, index) => (
                <div key={index} className={`p-4 rounded-lg text-center ${
                  index === 0 ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200' :
                  index === 1 ? 'bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200' :
                  'bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200'
                }`}>
                  <div className={`text-2xl font-bold mb-1 ${
                    index === 0 ? 'text-yellow-600' :
                    index === 1 ? 'text-gray-600' :
                    'text-orange-600'
                  }`}>
                    #{contributor.rank}
                  </div>
                  <h4 className="font-medium mb-2">{contributor.name}</h4>
                  <div className="text-sm text-muted-foreground">
                    <div>{contributor.points} points</div>
                    <div>{contributor.contributions} contributions</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}