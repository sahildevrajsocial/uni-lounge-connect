-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('notes-files', 'notes-files', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('lost-found-images', 'lost-found-images', true);

-- Create storage policies for notes files (documents and images)
CREATE POLICY "Notes files are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'notes-files');

CREATE POLICY "Users can upload notes files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'notes-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own notes files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'notes-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own notes files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'notes-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for lost-found images
CREATE POLICY "Lost-found images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'lost-found-images');

CREATE POLICY "Users can upload lost-found images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'lost-found-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own lost-found images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'lost-found-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own lost-found images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'lost-found-images' AND auth.uid()::text = (storage.foldername(name))[1]);