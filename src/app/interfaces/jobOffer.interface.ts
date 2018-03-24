export interface IJobOffer {
  id?: string;
  date?: number;
  polish: {
    title: string;
    text: string;
    country: string;
    region: string;
    city: string;
  };
  english: {
    title: string;
    text: string;
    country: string;
    region: string;
    city: string;
  };
  german: {
    title: string;
    text: string;
    country: string;
    region: string;
    city: string;
  };
}
