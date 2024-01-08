export interface Prediction {
  confidence: string;
  disease: string;
  benign_moles: string;
  predictions: {
    [key: string]: string;
  };
  id: number;
  image: string;
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
