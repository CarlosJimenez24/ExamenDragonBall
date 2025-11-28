export interface Transformation {
  id: number;
  name: string;
  image: string;
  ki: string;
}

export interface Planet {
  id: number;
  name: string;
  isDestroyed: boolean;
  description: string;
  image: string;
}

export interface Character {
  id: number;
  name: string;
  ki: string;
  maxKi: string;
  race: string;
  gender: string;
  description: string;
  image: string;
  affiliation: string;
  deletedAt: string | null;
  originPlanet: Planet;
  transformations: Transformation[];
}

export interface APILinks {
  first: string;
  previous: string;
  next: string;
  last: string;
}

export interface APIMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface APIResponse {
  items: Character[];
  meta: APIMeta;
  links: APILinks;
}
