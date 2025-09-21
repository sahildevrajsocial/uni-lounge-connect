import { BookOpen, Github, Twitter, Instagram, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg campus-gradient flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                CampusConnect
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting students across campuses with the tools they need to succeed academically and socially.
            </p>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="p-2">
                <Github className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="p-2">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="p-2">
                <Instagram className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="font-semibold">Features</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#notes" className="hover:text-primary transition-smooth">Study Materials</a></li>
              <li><a href="#lost-found" className="hover:text-primary transition-smooth">Lost & Found</a></li>
              <li><a href="#events" className="hover:text-primary transition-smooth">Campus Events</a></li>
              <li><a href="#leaderboard" className="hover:text-primary transition-smooth">Leaderboards</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-smooth">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Community Guidelines</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>hello@campusconnect.edu</span>
              </div>
              <div>
                <Button size="sm" className="campus-gradient text-white">
                  Join Our Community
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 CampusConnect. All rights reserved. Built with ❤️ for students.</p>
        </div>
      </div>
    </footer>
  );
}