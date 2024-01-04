export interface PostCreateRequest {
  title: string;
  content: string;
  image?: File; // assuming image is optional
}

export interface PostCreateResponse {
  message: string;
  post: {
    post_id: number;
    title: string;
    content: string;
    image_url?: string;
    author: string;
    comments: any[];
    reactions: any[];
    created_at: Date;
    updated_at: Date;
    _id: string;
  };
}
