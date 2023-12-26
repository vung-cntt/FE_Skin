export interface Prediction {
  confidence: string;
  disease: string;
  id: number;
  image: object; // or a more specific type if you know the structure
  time: string;
  userId: string;
  username: string;
}
export interface PredictionPage {
  data: Prediction[];
  total_records: number;
  total_pages: number;
  current_page: number;
  page_size: number;
}
