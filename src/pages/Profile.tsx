import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  User, Edit, Save, X, Upload, BookOpen, Search, 
  Calendar, Trophy, Mail, Phone, MapPin, Star
} from "lucide-react";

interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  points: number;
  created_at: string;
  updated_at: string;
}

interface UserStats {
  notes_count: number;
  lost_found_count: number;
  events_count: number;
  total_downloads: number;
  total_likes: number;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    notes_count: 0,
    lost_found_count: 0,
    events_count: 0,
    total_downloads: 0,
    total_likes: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchProfile();
    fetchUserStats();
  }, [user, navigate]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      const [notesResult, lostFoundResult, eventsResult] = await Promise.all([
        supabase.from('notes').select('downloads, likes').eq('user_id', user.id),
        supabase.from('lost_found').select('id').eq('user_id', user.id),
        supabase.from('events').select('id').eq('user_id', user.id)
      ]);

      const notes = notesResult.data || [];
      const totalDownloads = notes.reduce((sum, note) => sum + (note.downloads || 0), 0);
      const totalLikes = notes.reduce((sum, note) => sum + (note.likes || 0), 0);

      setUserStats({
        notes_count: notes.length,
        lost_found_count: lostFoundResult.data?.length || 0,
        events_count: eventsResult.data?.length || 0,
        total_downloads: totalDownloads,
        total_likes: totalLikes
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!user || !profile) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('lost-found-images')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('lost-found-images')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', user.id);

      if (updateError) {
        toast({ title: "Profile update failed", description: updateError.message, variant: "destructive" });
        return;
      }

      setProfile({ ...profile, avatar_url: publicUrl });
      toast({ title: "Avatar updated successfully!" });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !profile) return;

    const formData = new FormData(e.currentTarget);
    const updates = {
      username: formData.get('username') as string,
      full_name: formData.get('full_name') as string,
      bio: formData.get('bio') as string,
    };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) {
        toast({ title: "Update failed", description: error.message, variant: "destructive" });
        return;
      }

      setProfile({ ...profile, ...updates });
      setIsEditing(false);
      toast({ title: "Profile updated successfully!" });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({ title: "Update failed", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">Profile not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>My Profile</span>
                </CardTitle>
                <Button
                  variant={isEditing ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={profile.avatar_url || undefined} />
                        <AvatarFallback className="text-lg">
                          {profile.full_name?.charAt(0) || profile.username?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <label className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 cursor-pointer hover:bg-primary-dark">
                        <Upload className="h-3 w-3" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleAvatarUpload(file);
                          }}
                          disabled={uploading}
                        />
                      </label>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          name="full_name"
                          defaultValue={profile.full_name || ''}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          name="username"
                          defaultValue={profile.username || ''}
                          placeholder="Enter your username"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      defaultValue={profile.bio || ''}
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile.avatar_url || undefined} />
                      <AvatarFallback className="text-lg">
                        {profile.full_name?.charAt(0) || profile.username?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold">
                        {profile.full_name || profile.username || 'Anonymous User'}
                      </h2>
                      {profile.username && profile.full_name && (
                        <p className="text-muted-foreground">@{profile.username}</p>
                      )}
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-accent hover:bg-accent-light">
                          <Trophy className="h-3 w-3 mr-1" />
                          {profile.points} points
                        </Badge>
                        <Badge variant="outline">
                          Member since {new Date(profile.created_at).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {profile.bio && (
                    <div>
                      <h3 className="font-medium mb-2">About</h3>
                      <p className="text-muted-foreground">{profile.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-soft">
              <CardContent className="p-4 text-center">
                <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{userStats.notes_count}</div>
                <div className="text-sm text-muted-foreground">Notes Shared</div>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardContent className="p-4 text-center">
                <Search className="h-8 w-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold">{userStats.lost_found_count}</div>
                <div className="text-sm text-muted-foreground">Items Reported</div>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardContent className="p-4 text-center">
                <Calendar className="h-8 w-8 text-secondary mx-auto mb-2" />
                <div className="text-2xl font-bold">{userStats.events_count}</div>
                <div className="text-sm text-muted-foreground">Events Created</div>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardContent className="p-4 text-center">
                <Star className="h-8 w-8 text-warning mx-auto mb-2" />
                <div className="text-2xl font-bold">{userStats.total_likes}</div>
                <div className="text-sm text-muted-foreground">Total Likes</div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/')}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button 
                variant="destructive" 
                className="w-full justify-start"
                onClick={signOut}
              >
                <User className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;