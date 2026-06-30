import { Helmet } from 'react-helmet-async';

interface Props {
  /** Absolute path part of the URL, e.g. "/products" */
  path: string;
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
}

const BASE = 'https://ecovia.co.in';

/**
 * Canonical + Open Graph + Twitter tag block.
 * Drop into any route to prevent duplicate indexing and improve AI page selection.
 */
const CanonicalSEO = ({ path, title, description, image, type = 'website' }: Props) => {
  const url = `${BASE}${path.startsWith('/') ? path : `/${path}`}`;
  const img = image || `${BASE}/logo.png`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Mittika by Ecovia Enterprises" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta property="og:locale" content="en_IN" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />
    </Helmet>
  );
};

export default CanonicalSEO;