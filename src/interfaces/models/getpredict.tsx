export interface Prediction {
  confidence: string;
  disease: string;
  id: number;
  image: object; // or a more specific type if you know the structure
  time: string;
  userId: string;
  username: string;
}
