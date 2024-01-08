export interface PredictionDetail {
  data: {
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
  };
}
