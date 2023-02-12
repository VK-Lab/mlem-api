export interface Atrribute {
  value: string | null | number;
  trait_type: string;
}

export interface Erc721Metadata {
  image: string;
  name: string;
  description: string;
  attributes: Atrribute[];
}
