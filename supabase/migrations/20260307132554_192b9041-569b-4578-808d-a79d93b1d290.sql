CREATE TABLE public.product_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL,
  reviewer_name TEXT NOT NULL,
  reviewer_location TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  product_quality INTEGER CHECK (product_quality >= 1 AND product_quality <= 5),
  delivery_rating INTEGER CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
  packaging_rating INTEGER CHECK (packaging_rating >= 1 AND packaging_rating <= 5),
  review TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.product_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view feedback" ON public.product_feedback FOR SELECT USING (true);
CREATE POLICY "Anyone can submit feedback" ON public.product_feedback FOR INSERT WITH CHECK (true);