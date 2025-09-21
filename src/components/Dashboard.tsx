import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, Search, Calendar, Trophy, Plus, TrendingUp, 
  Users, Star, MapPin, Clock, Download, Eye
} from "lucide-react";

const recentNotes = [
  { title: "Data Structures - Trees & Graphs", subject: "CS301", author: "John Doe", downloads: 234, rating: 4.8 },
  { title: "Organic Chemistry Lab Manual", subject: "CHEM201", author: "Jane Smith", downloads: 156, rating: 4.6 },
  { title: "Linear Algebra - Eigen Values", subject: "MATH202", author: "Mike Wilson", downloads: 189, rating: 4.9 }
];

const lostItems = [
  { item: "iPhone 13 Pro", location: "Library 2nd Floor", time: "2 hours ago", status: "Lost" },
  { item: "Blue Backpack", location: "Cafeteria", time: "5 hours ago", status: "Found" },
  { item: "Scientific Calculator", location: "Lab Building", time: "1 day ago", status: "Lost" }
];

const upcomingEvents = [
  { title: "Web Dev Workshop", club: "Tech Club", date: "Tomorrow", attendees: 45, type: "Workshop" },
  { title: "Annual Hackathon", club: "CS Society", date: "This Weekend", attendees: 234, type: "Competition" },
  { title: "Career Fair 2024", club: "Placement Cell", date: "Next Week", attendees: 567, type: "Fair" }
];

const topContributors = [
  { name: "Sarah Johnson", points: 2340, contributions: 45, rank: 1 },
  { name: "Alex Chen", points: 2156, contributions: 38, rank: 2 },
  { name: "Maria Garcia", points: 1987, contributions: 42, rank: 3 }
];

export function Dashboard() {
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
              <Button size="sm" className="bg-primary hover:bg-primary-dark">
                <Plus className="h-4 w-4 mr-2" />
                Upload Notes
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentNotes.map((note, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{note.title}</h4>
                      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                        <Badge variant="secondary">{note.subject}</Badge>
                        <span>by {note.author}</span>
                        <div className="flex items-center">
                          <Download className="h-3 w-3 mr-1" />
                          {note.downloads}
                        </div>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                          {note.rating}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
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
              <Button size="sm" className="bg-accent hover:bg-accent-light">
                <Plus className="h-4 w-4 mr-2" />
                Report Item
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lostItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <h4 className="font-medium">{item.item}</h4>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{item.location}</span>
                        <Clock className="h-3 w-3" />
                        <span>{item.time}</span>
                      </div>
                    </div>
                    <Badge variant={item.status === 'Found' ? 'default' : 'destructive'}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Events */}
          <Card id="events" className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-secondary" />
                <CardTitle>Upcoming Events</CardTitle>
              </div>
              <Button size="sm" className="bg-secondary hover:bg-secondary-light">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{event.title}</h4>
                      <Badge variant="outline">{event.type}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{event.club}</span>
                      <div className="flex items-center space-x-3">
                        <span>{event.date}</span>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {event.attendees}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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