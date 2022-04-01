export interface Portfolio {
  id?: string;
  dateCreation?: Date;
  updatedDate?: Date;
  name: string;
  principal?: boolean;
  ticks?: Tick[];
}

export interface Tick {
  loading?: boolean;
  addedDate?: Date;
  priceWhenAdded: number;
  currentPrice?: number;
  symbol?: string;
  currency: string;
  delta?: number;
}
