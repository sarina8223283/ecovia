// Official product packaging photos (actual photographs supplied by Ecovia Enterprises).
// These are real product photos, NOT customer-submitted feedback, and are displayed
// separately from reviews with an "actual product" disclaimer on product pages.
// Some pouches still carry the earlier "Mittika" label spelling; see the page disclaimer.
import amlaFront from '@/assets/amla-packaging-front.jpg.asset.json';
import amlaBack from '@/assets/amla-packaging-back.jpg.asset.json';
import brahmiFront from '@/assets/brahmi-packaging-front.jpg.asset.json';
import brahmiBack from '@/assets/brahmi-packaging-back.jpg.asset.json';
import bhringrajFront from '@/assets/bhringraj-packaging-front.jpg.asset.json';
import bhringrajBack from '@/assets/bhringraj-packaging-back.jpg.asset.json';
import hibiscusFront from '@/assets/hibiscus-packaging-front.jpg.asset.json';
import hibiscusBack from '@/assets/hibiscus-packaging-back.jpg.asset.json';
import kasturiHaldiFront from '@/assets/kasturi-haldi-packaging-front.jpg.asset.json';
import kasturiHaldiBack from '@/assets/kasturi-haldi-packaging-back.jpg.asset.json';
import moringaFront from '@/assets/moringa-packaging-front.jpg.asset.json';
import moringaBack from '@/assets/moringa-packaging-back.jpg.asset.json';
import multaniMittiFront from '@/assets/multani-mitti-packaging-front.jpg.asset.json';
import multaniMittiBack1 from '@/assets/multani-mitti-packaging-back-1.jpg.asset.json';
import multaniMittiBack2 from '@/assets/multani-mitti-packaging-back-2.jpg.asset.json';
import neemFront from '@/assets/neem-packaging-front.jpg.asset.json';
import neemBack from '@/assets/neem-packaging-back.jpg.asset.json';
import orangePeelFront1 from '@/assets/orange-peel-packaging-front-1.jpg.asset.json';
import orangePeelFront2 from '@/assets/orange-peel-packaging-front-2.jpg.asset.json';
import orangePeelBack1 from '@/assets/orange-peel-packaging-back-1.jpg.asset.json';
import orangePeelBack2 from '@/assets/orange-peel-packaging-back-2.jpg.asset.json';
import orangePeelBack3 from '@/assets/orange-peel-packaging-back-3.jpg.asset.json';
import rithaFront from '@/assets/ritha-packaging-front.jpg.asset.json';
import rithaBack from '@/assets/ritha-packaging-back.jpg.asset.json';
import rosePetalsFront from '@/assets/rose-petals-packaging-front.jpg.asset.json';
import rosePetalsBack from '@/assets/rose-petals-packaging-back.jpg.asset.json';
import shikakaiFront from '@/assets/shikakai-packaging-front.jpg.asset.json';
import shikakaiBack from '@/assets/shikakai-packaging-back.jpg.asset.json';

export const packagingPhotos: Record<string, Array<{ src: string; label: string }>> = {
  'amla-powder': [
    { src: amlaFront.url, label: 'Actual product photo · front' },
    { src: amlaBack.url, label: 'Actual product photo · back label' },
  ],
  'brahmi-powder': [
    { src: brahmiFront.url, label: 'Actual product photo · front' },
    { src: brahmiBack.url, label: 'Actual product photo · back label' },
  ],
  'bhringraj-powder': [
    { src: bhringrajFront.url, label: 'Actual product photo · front' },
    { src: bhringrajBack.url, label: 'Actual product photo · back label' },
  ],
  'hibiscus-powder': [
    { src: hibiscusFront.url, label: 'Actual product photo · front' },
    { src: hibiscusBack.url, label: 'Actual product photo · back label' },
  ],
  'kasturi-haldi': [
    { src: kasturiHaldiFront.url, label: 'Actual product photo · front' },
    { src: kasturiHaldiBack.url, label: 'Actual product photo · back label' },
  ],
  'moringa-powder': [
    { src: moringaFront.url, label: 'Actual product photo · front' },
    { src: moringaBack.url, label: 'Actual product photo · back label' },
  ],
  'multani-mitti': [
    { src: multaniMittiFront.url, label: 'Actual product photo · front' },
    { src: multaniMittiBack1.url, label: 'Actual product photo · back label' },
    { src: multaniMittiBack2.url, label: 'Actual product photo · back label (50g pack)' },
  ],
  'neem-powder': [
    { src: neemFront.url, label: 'Actual product photo · front' },
    { src: neemBack.url, label: 'Actual product photo · back label' },
  ],
  'orange-peel-powder': [
    { src: orangePeelFront1.url, label: 'Actual product photo · front' },
    { src: orangePeelFront2.url, label: 'Actual product photo · front (alternate view)' },
    { src: orangePeelBack1.url, label: 'Actual product photo · back label' },
    { src: orangePeelBack2.url, label: 'Actual product photo · back label (alternate view)' },
    { src: orangePeelBack3.url, label: 'Actual product photo · back label (alternate view)' },
  ],
  'ritha-powder': [
    { src: rithaFront.url, label: 'Actual product photo · front' },
    { src: rithaBack.url, label: 'Actual product photo · back label' },
  ],
  'rose-petals-powder': [
    { src: rosePetalsFront.url, label: 'Actual product photo · front' },
    { src: rosePetalsBack.url, label: 'Actual product photo · back label' },
  ],
  'shikakai-powder': [
    { src: shikakaiFront.url, label: 'Actual product photo · front' },
    { src: shikakaiBack.url, label: 'Actual product photo · back label' },
  ],
};

// Products still missing actual packaging photos:
// onion-powder, coconut-powder, rosemary-powder.
