export interface IJobOffer {
  id?: string;
  date?: number;
  polish: {
    polishTitle: string;
    polishText: string;
    polishCountry: string;
    polishRegion: string;
    polishCity: string;
  };
  english: {
    englishTitle: string;
    englishText: string;
    englishCountry: string;
    englishRegion: string;
    englishCity: string;
  };
  german: {
    germanTitle: string;
    germanText: string;
    germanCountry: string;
    germanRegion: string;
    germanCity: string;
  };
}
