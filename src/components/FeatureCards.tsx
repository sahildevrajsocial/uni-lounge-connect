import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, Calendar, Trophy, Upload, Users, Star, MapPin } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Notes & Study Materials",
    description: "Share and access study notes, past papers, and lab manuals organized by subject and semester.",
    color: "primary",
    stats: "1,000+ Materials",
    actions: ["Upload Notes", "Browse Subjects", "Download PDFs"]
  },
  {
    icon: Search,
    title: "Lost & Found",
    description: "Post lost items with photos and location. Help classmates find their belongings quickly.",
    color: "accent",
    stats: "95% Success Rate",
    actions: ["Report Lost Item", "Browse Found Items", "Claim Item"]
  },
  {
    icon: Calendar,
    title: "Campus Events",
    description: "Discover hackathons, fests, seminars, and club activities. RSVP and connect with attendees.",
    color: "secondary",
    stats: "50+ Events/Month",
    actions: ["Browse Events", "Create Event", "RSVP"]
  },
  {
    icon: Trophy,
    title: "Leaderboards",
    description: "Earn points for helping others, uploading notes, and being active. Compete with your peers!",
    color: "warning",
    stats: "Top 100 Contributors",
    actions: ["View Rankings", "Earn Points", "My Progress"]
  }
];

export function FeatureCards() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need for{" "}
            <span className="text-primary">Campus Life</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From academic resources to social connections, CampusConnect brings your entire campus experience together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={feature.title} className="group shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${
                    feature.color === 'primary' ? 'bg-primary/10 text-primary' :
                    feature.color === 'secondary' ? 'bg-secondary/10 text-secondary' :
                    feature.color === 'accent' ? 'bg-accent/10 text-accent' :
                    'bg-warning/10 text-warning'
                  }`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-muted-foreground">{feature.stats}</div>
                  </div>
                </div>
                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {feature.actions.map((action, actionIndex) => (
                    <Button
                      key={action}
                      variant={actionIndex === 0 ? "default" : "outline"}
                      size="sm"
                      className={`w-full justify-start ${
                        actionIndex === 0 && feature.color === 'primary' ? 'bg-primary hover:bg-primary-dark' :
                        actionIndex === 0 && feature.color === 'secondary' ? 'bg-secondary hover:bg-secondary-light' :
                        actionIndex === 0 && feature.color === 'accent' ? 'bg-accent hover:bg-accent-light' :
                        actionIndex === 0 ? 'bg-warning hover:bg-warning' : ''
                      }`}
                    >
                      {actionIndex === 0 && <Upload className="mr-2 h-4 w-4" />}
                      {actionIndex === 1 && <Users className="mr-2 h-4 w-4" />}
                      {actionIndex === 2 && <Star className="mr-2 h-4 w-4" />}
                      {action}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <Button size="lg" className="campus-gradient text-white shadow-medium">
            Explore All Features
          </Button>
        </div>
      </div>
    </section>
  );
}