export interface Post {
  countViews: number;
  description: string;
  id?: string;
  title: string;
  content?: string;
  creationDate?: Date;
  updatedDate?: Date;
  draft?: boolean;
  coverId?: string;
  tags?: string[];
}

export interface PostSearchCriteria {
  id?: string;
  datebefore?: Date;
  dateAfter?: Date;
  title?: string;
  content?: string;
  tag?: string;
}
