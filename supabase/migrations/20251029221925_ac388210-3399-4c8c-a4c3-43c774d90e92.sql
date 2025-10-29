-- Create table for shipping calculations history
CREATE TABLE public.shipping_calculations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  origin_zip VARCHAR(9) NOT NULL,
  destination_zip VARCHAR(9) NOT NULL,
  weight DECIMAL(10,2) NOT NULL,
  length DECIMAL(10,2),
  width DECIMAL(10,2),
  height DECIMAL(10,2),
  service_type VARCHAR(50),
  price DECIMAL(10,2),
  delivery_days INT,
  response_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for tracking queries history
CREATE TABLE public.tracking_queries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_code VARCHAR(50) NOT NULL,
  status VARCHAR(100),
  last_update_date TIMESTAMP WITH TIME ZONE,
  response_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.shipping_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_queries ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since it's a public service)
CREATE POLICY "Allow public read access to shipping calculations" 
ON public.shipping_calculations 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert to shipping calculations" 
ON public.shipping_calculations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public read access to tracking queries" 
ON public.tracking_queries 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert to tracking queries" 
ON public.tracking_queries 
FOR INSERT 
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_shipping_calculations_created_at ON public.shipping_calculations(created_at DESC);
CREATE INDEX idx_tracking_queries_created_at ON public.tracking_queries(created_at DESC);
CREATE INDEX idx_tracking_queries_code ON public.tracking_queries(tracking_code);