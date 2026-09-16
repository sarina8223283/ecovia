DROP VIEW IF EXISTS public.public_product_reviews;

-- Store only a short, city-level location for reviews
CREATE OR REPLACE FUNCTION public.sanitize_review_location()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.reviewer_location := NULLIF(btrim(left(split_part(COALESCE(NEW.reviewer_location, ''), ',', 1), 60)), '');
  NEW.reviewer_name := left(btrim(NEW.reviewer_name), 50);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sanitize_review_location_trg ON public.product_feedback;
CREATE TRIGGER sanitize_review_location_trg
BEFORE INSERT OR UPDATE ON public.product_feedback
FOR EACH ROW EXECUTE FUNCTION public.sanitize_review_location();

UPDATE public.product_feedback
SET reviewer_location = NULLIF(btrim(left(split_part(COALESCE(reviewer_location, ''), ',', 1), 60)), '');

GRANT SELECT ON public.product_feedback TO anon, authenticated;
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.product_feedback;
CREATE POLICY "Anyone can view reviews" ON public.product_feedback
FOR SELECT TO anon, authenticated
USING (true);

-- Guest order lookup: signed-out tracking links only
REVOKE EXECUTE ON FUNCTION public.get_guest_order(text, text) FROM authenticated;
