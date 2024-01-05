export interface CommentReply {
  reply_id: number;
  text: string;
  user: string;
}

export interface Comment {
  _id: string;
  comment_id: number;
  replies: CommentReply[];
  text: string;
  user: string;
}

export interface Reaction {
  type: string;
  user: string;
}

export interface Post {
  _id: string;
  author: string;
  comments: Comment[];
  content: string;
  created_at: string;
  image_url: string;
  last_comment_id: number;
  post_id: number;
  reactions: Reaction[];
  title: string;
  updated_at: string;
}

export interface PostsResponse {
  data: Post[];
}
