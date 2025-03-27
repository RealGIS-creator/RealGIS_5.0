export interface Icon {
  src: string;
  alt: string;
  action: string | null;
}

export interface Title {
  text: string;
  icons: Icon[];
}

export interface ContactInfo {
  idCredito: string;
  identificacion: string;
  nombre: string;
  noAcreditado: string;
  cis: string;
}

export interface DetailItem {
  label: string;
  value: string;
}

export interface SectionBase {
  type: string;
  title: string;
}

// Sección "text-top" con value como arreglo de objetos.
export interface TextSection extends SectionBase {
  type: 'text';
  value: string;
  // detail: BadgeItem[];
}

// Cada badge ahora es un objeto con texto y estilo
export interface BadgeItem {
  text: string;
  style: string;
}

export interface TextTopSection extends SectionBase {
  type: 'text-top';
  value: DetailItem[];
  icons: Icon[];
}

export interface BadgesSection extends SectionBase {
  type: 'badges';
  badges: BadgeItem[];
}

// Secciones expandibles con detalles
export interface ExpandibleColumnSection extends SectionBase {
  type: 'expandible-column';
  visible: boolean;
  details: DetailItem[];
}

export interface ExpandibleRowSection extends SectionBase {
  type: 'expandible-row';
  visible: boolean;
  details: DetailItem[];
}

export interface ActionSection extends SectionBase {
  type: 'action';
  action: string;
}

export type Section =
  | TextSection
  | TextTopSection
  | BadgesSection
  | ExpandibleColumnSection
  | ExpandibleRowSection
  | ActionSection;

export interface Location {
  coords: string;
  icon: string;
}

export interface Actions {
  [key: string]: string;
}

export interface ContactCard {
  id: string;
  title: Title;
  contactInfo?: ContactInfo;
  sections: Section[];
  location: Location;
  actions: Actions;
}

export interface ContactCardsData {
  appMovableCard: ContactCard[];
}
