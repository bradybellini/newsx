export interface Article {
  feed_id: string;
  title: string;
  link: string;
  authors?: string[];
  published: Date;
  summary?: string;
  guid: string;
  uid: string;
  tags?: string[];
}
