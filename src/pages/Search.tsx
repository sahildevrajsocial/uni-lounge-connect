import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useSearch, type ContentType, type SearchFilters } from '@/hooks/useSearch';
import { Search as SearchIcon, BookOpen, Calendar, Package, X, Filter, Eye, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const Search = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    contentType: 'all',
    subject: '',
    course: '',
    semester: '',
    eventDateFrom: '',
    eventDateTo: '',
    lostFoundType: '',
    lostFoundStatus: '',
    location: '',
  });

  const { results, isLoading } = useSearch(query, filters);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    if (newQuery) {
      setSearchParams({ q: newQuery });
    } else {
      setSearchParams({});
    }
  };

  const clearFilters = () => {
    setFilters({
      contentType: 'all',
      subject: '',
      course: '',
      semester: '',
      eventDateFrom: '',
      eventDateTo: '',
      lostFoundType: '',
      lostFoundStatus: '',
      location: '',
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'note':
        return <BookOpen className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
      case 'lost_found':
        return <Package className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      note: { label: 'Note', variant: 'default' as const },
      event: { label: 'Event', variant: 'secondary' as const },
      lost_found: { label: 'Lost & Found', variant: 'outline' as const },
    };
    return badges[type as keyof typeof badges] || { label: type, variant: 'default' as const };
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Search Campus
          </h1>
          <p className="text-muted-foreground mb-6">
            Find notes, events, and lost & found items across campus
          </p>

          {/* Search Bar */}
          <div className="relative mb-4">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for notes, events, or items..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-10 h-12 text-lg"
            />
            {query && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => handleSearch('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Content Type Tabs */}
          <Tabs
            value={filters.contentType}
            onValueChange={(value) => setFilters({ ...filters, contentType: value as ContentType })}
            className="mb-4"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="lost_found">Lost & Found</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Advanced Filters Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="mb-4"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Hide' : 'Show'} Advanced Filters
          </Button>

          {/* Advanced Filters */}
          {showFilters && (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Advanced Filters</CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={filters.contentType} className="w-full">
                  {/* Notes Filters */}
                  <TabsContent value="notes" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          placeholder="e.g., Mathematics"
                          value={filters.subject}
                          onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="course">Course</Label>
                        <Input
                          id="course"
                          placeholder="e.g., MATH 101"
                          value={filters.course}
                          onChange={(e) => setFilters({ ...filters, course: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="semester">Semester</Label>
                        <Input
                          id="semester"
                          placeholder="e.g., Fall 2024"
                          value={filters.semester}
                          onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Events Filters */}
                  <TabsContent value="events" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dateFrom">From Date</Label>
                        <Input
                          id="dateFrom"
                          type="date"
                          value={filters.eventDateFrom}
                          onChange={(e) => setFilters({ ...filters, eventDateFrom: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateTo">To Date</Label>
                        <Input
                          id="dateTo"
                          type="date"
                          value={filters.eventDateTo}
                          onChange={(e) => setFilters({ ...filters, eventDateTo: e.target.value })}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Lost & Found Filters */}
                  <TabsContent value="lost_found" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select
                          value={filters.lostFoundType || "all"}
                          onValueChange={(value) => setFilters({ ...filters, lostFoundType: value === "all" ? "" : value as any })}
                        >
                          <SelectTrigger id="type">
                            <SelectValue placeholder="All Types" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="lost">Lost</SelectItem>
                            <SelectItem value="found">Found</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={filters.lostFoundStatus || "all"}
                          onValueChange={(value) => setFilters({ ...filters, lostFoundStatus: value === "all" ? "" : value as any })}
                        >
                          <SelectTrigger id="status">
                            <SelectValue placeholder="All Statuses" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="e.g., Library"
                          value={filters.location}
                          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Search Results */}
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Searching...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <SearchIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">
                {query ? 'No results found' : 'Start searching'}
              </h3>
              <p className="text-muted-foreground">
                {query
                  ? 'Try adjusting your search terms or filters'
                  : 'Enter a search term to find notes, events, or items'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Found {results.length} result{results.length !== 1 ? 's' : ''}
              </p>
              {results.map((result) => {
                const typeBadge = getTypeBadge(result.type);
                return (
                  <Card key={`${result.type}-${result.id}`} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getTypeIcon(result.type)}
                            <Badge variant={typeBadge.variant}>{typeBadge.label}</Badge>
                            {result.tags && result.tags.length > 0 && (
                              <div className="flex gap-1 flex-wrap">
                                {result.tags.slice(0, 3).map((tag, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <CardTitle className="text-xl mb-1">{result.title}</CardTitle>
                          <CardDescription>
                            {result.type === 'event' && result.event_date && (
                              <span className="font-medium">
                                {format(new Date(result.event_date), 'PPP')} • 
                              </span>
                            )}
                            {' '}
                            {format(new Date(result.created_at), 'PP')}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-2 mb-4">
                        {result.description || result.content || 'No description available'}
                      </p>
                      {result.type === 'note' && (
                        <>
                          <div className="flex gap-2 text-sm text-muted-foreground mb-3">
                            {result.subject && <span>Subject: {result.subject}</span>}
                            {result.course && <span>• Course: {result.course}</span>}
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                if (result.file_url) {
                                  window.open(result.file_url, '_blank');
                                } else {
                                  toast({ title: "No file attached to this note" });
                                }
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            {result.file_url && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = result.file_url;
                                  link.download = `${result.title}.${result.file_url.split('.').pop()}`;
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
                        </>
                      )}
                      {result.type === 'event' && (
                        <div className="flex gap-2 text-sm text-muted-foreground">
                          {result.location && <span>📍 {result.location}</span>}
                          {result.current_attendees !== undefined && (
                            <span>• {result.current_attendees} attending</span>
                          )}
                        </div>
                      )}
                      {result.type === 'lost_found' && (
                        <>
                          {result.image_url && (
                            <div 
                              className="mb-3 w-full h-48 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-smooth border border-border"
                              onClick={() => window.open(result.image_url, '_blank')}
                            >
                              <img 
                                src={result.image_url} 
                                alt={result.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex gap-2 text-sm text-muted-foreground">
                            {result.location && <span>📍 {result.location}</span>}
                            {result.status && (
                              <span>• Status: {result.status}</span>
                            )}
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Search;
