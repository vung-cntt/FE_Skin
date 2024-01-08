import BasePageContainer from '../layout/PageContainer';
import { BreadcrumbProps } from 'antd';
import { webRoutes } from '../../routes/web';
import { Link } from 'react-router-dom';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import {
  createPost,
  getAllPosts,
  addComment,
  addReply,
  addReaction,
} from '../../api/post';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Post } from '../../interfaces/models/getPost';

const breadcrumb: BreadcrumbProps = {
  items: [
    {
      key: webRoutes.dashboard,
      title: <Link to={webRoutes.dashboard}>Dashboard</Link>,
    },
  ],
};

const Dashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [title, setTitle] = useState('');
  const [replies, setReplies] = useState<Record<number, string>>({});
  const [showReplyInput, setShowReplyInput] = useState<Record<number, boolean>>(
    {}
  );
  const [image, setImage] = useState<File | null>(null);
  const [selectedName, setSelectedName] = useState('');
  const [openReplyId, setOpenReplyId] = useState<number | null>(null);

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Cập nhật kiểu của state
  // const [selectedFile, setSelectedFile] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Record<number, string>>({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getAllPosts();
        setPosts(response.data);
      } catch (error) {
        console.error('Lỗi khi tải bài viết:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  const handleIconClick = () => {
    setShowUploadForm(!showUploadForm);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const post = await createPost(title, image);
      toast.success('Create post successfully');
      window.location.reload();
      console.log('Post created', post);
    } catch (error) {
      alert('Failed to create post');
    }
  };
  const handleAddComment = async (postId: number) => {
    try {
      const commentText = comments[postId];
      if (commentText) {
        await addComment(postId, commentText);
        setComments((prevComments) => ({ ...prevComments, [postId]: '' })); // Reset comment input
        const response = await getAllPosts();
        setPosts(response.data);
      }
    } catch (error) {
      console.error('Failed to add comment', error);
    }
  };
  const handleAddReply = async (postId: number, commentId: number) => {
    try {
      const replyText = replies[commentId];
      // Nếu replyText không phải là chuỗi rỗng, tiếp tục thêm reply
      if (replyText) {
        await addReply(postId, commentId, replyText);
        setReplies((prevReplies) => ({ ...prevReplies, [commentId]: '' })); // Reset reply input
        // Tải lại bài viết sau khi thêm reply
        const response = await getAllPosts();
        setPosts(response.data);
        setShowReplyInput((prevShow) => ({ ...prevShow, [commentId]: false })); // Ẩn input
      }
    } catch (error) {
      console.error('Failed to add reply', error);
    }
  };
  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setSelectedName(file.name);
      setImagePreview(URL.createObjectURL(file)); // Tạo URL xem trước
    }
  };
  const handleCloseForm = () => {
    setShowUploadForm(false);
    setImagePreview(null);
    setSelectedName('');
    setImage(null);
  };
  const handleImageClick = (post: Post) => {
    setSelectedPost(post);
    setShowImageModal(true);
  };

  const handleToggleReplies = (commentId: number) => {
    if (openReplyId === commentId) {
      setOpenReplyId(null); // Nếu comment hiện tại đã mở, đóng nó lại.
    } else {
      setOpenReplyId(commentId); // Nếu comment hiện tại đóng, mở nó ra.
    }
  };
  const toggleReplyInput = (commentId: number) => {
    setShowReplyInput((prevShow) => ({
      ...prevShow,
      [commentId]: !prevShow[commentId],
    }));
  };
  const handleReaction = async (postId: number, type: 'like' | 'unlike') => {
    try {
      await addReaction(postId, type);
      const response = await getAllPosts();
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to add reaction', error);
    }
  };

  return (
    <BasePageContainer breadcrumb={breadcrumb} transparent={true}>
      {showImageModal && selectedPost && (
        <div className="modal" onClick={() => setShowImageModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="image-container">
              <img src={selectedPost.image_url} alt="Selected Image" />
            </div>
            <div className="post-info">
              {/* Hiển thị thông tin bài đăng ở đây */}
              <div className="info-author">
                <a className="media-left" href="#/">
                  <img
                    className="img-circle img-sm"
                    alt="Profile Picture"
                    src="https://bootdey.com/img/Content/avatar/avatar1.png"
                  />
                </a>
                <div>
                  <a
                    href="#/"
                    style={{ fontSize: '20px' }}
                    className="btn-link text-semibold media-heading box-inline"
                  >
                    {selectedPost.author}
                  </a>
                  <p className="text-muted text-sm">
                    <i className="fa fa-mobile fa-lg"></i>
                    {selectedPost.updated_at}
                  </p>
                </div>
              </div>
              <div>
                <span style={{ fontSize: '20px' }}>{selectedPost.title}</span>
              </div>

              <div className="pad-ver">
                <div className="btn-group">
                  <a
                    className="btn btn-sm btn-default btn-hover-success"
                    href="#/"
                  >
                    <i className="fa fa-thumbs-up"></i>
                  </a>
                  <a
                    className="btn btn-sm btn-default btn-hover-danger"
                    href="#/"
                  >
                    <i className="fa fa-thumbs-down"></i>
                  </a>
                </div>
              </div>
              <hr />
              <div className="comments-section">
                {selectedPost.comments.map((comment, index) => (
                  <div key={index}>
                    <div className="info-author">
                      <a className="media-left" href="#/">
                        <img
                          className="img-circle img-sm"
                          alt="Profile Picture"
                          src="https://bootdey.com/img/Content/avatar/avatar2.png" // Đây là avatar mẫu, thay thế bằng avatar thực tế nếu có
                        />
                      </a>
                      <div>
                        <a
                          href="#/"
                          style={{ fontSize: '20px' }}
                          className="btn-link text-semibold media-heading box-inline"
                        >
                          {comment.user}
                        </a>
                        <p style={{ fontSize: '15px' }}>{comment.text}</p>
                      </div>
                    </div>

                    {comment.replies &&
                      comment.replies.map((reply, index) => (
                        <div key={index} style={{ marginLeft: '20px' }}>
                          <div className="info-reply">
                            <a className="media-left" href="#/">
                              <img
                                className="img-circle img-sm"
                                alt="Profile Picture"
                                src="https://bootdey.com/img/Content/avatar/avatar1.png"
                              />
                            </a>
                            <div>
                              <a
                                href="#/"
                                style={{ fontSize: '20px' }}
                                className="btn-link text-semibold media-heading box-inline"
                              >
                                {reply.user}
                              </a>
                              <p>{reply.text}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <div>
        <link
          href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"
          rel="stylesheet"
        />
        <div className="container bootdey">
          <div className="col-md-12 bootstrap snippets">
            <div className="panel">
              <form onSubmit={handleSubmit}>
                <div className="panel-body">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What do you think ?"
                    className="form-control"
                  />
                  {/* <input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Content"
                  /> */}
                  <div className="mar-top clearfix">
                    {showUploadForm && (
                      <div className="upload-form">
                        <div className="close-button" onClick={handleCloseForm}>
                          <i className="fa fa-times"></i>
                        </div>
                        <div className="file-upload">
                          <h3>{selectedName || 'Click box to upload'}</h3>
                          <input type="file" onChange={handleFileChange} />
                          {imagePreview && (
                            <img src={imagePreview} alt="Preview" />
                          )}
                        </div>
                      </div>
                    )}
                    <div
                      className="btn btn-trans btn-icon add-tooltip"
                      onClick={handleIconClick}
                    >
                      <i className="fa fa-image"></i>
                    </div>
                    <button
                      className="btn btn-sm btn-primary pull-right"
                      type="submit"
                    >
                      <i className="fa fa-pencil fa-fw"></i>
                      Create Post
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <h2>Tất Cả Bài Viết</h2>
            {posts.map((post: Post) => (
              <div key={post._id}>
                <div className="panel">
                  <div className="panel-body">
                    <div className="media-block">
                      <a className="media-left" href="#/">
                        <img
                          className="img-circle img-sm"
                          alt="Profile Picture"
                          src="https://bootdey.com/img/Content/avatar/avatar1.png"
                        />
                      </a>
                      <div className="media-body">
                        <div className="mar-btm">
                          <a
                            href="#/"
                            className="btn-link text-semibold media-heading box-inline"
                          >
                            {post.author}
                          </a>
                          <p className="text-muted text-sm">
                            <i className="fa fa-mobile fa-lg"></i>
                            {post.updated_at}
                          </p>
                        </div>
                        <p>{post.title}</p>
                        <div className="image-container">
                          {post.image_url && (
                            <div className="post-image">
                              <img
                                src={post.image_url}
                                alt="Post"
                                onClick={() => handleImageClick(post)}
                              />
                            </div>
                          )}
                        </div>

                        <div
                          className="btn-group"
                          style={{ marginTop: '10px' }}
                        >
                          <button
                            className="btn btn-sm btn-default btn-hover-success"
                            onClick={() => handleReaction(post.post_id, 'like')}
                          >
                            <i className="fa fa-thumbs-up"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-default btn-hover-danger"
                            onClick={() =>
                              handleReaction(post.post_id, 'unlike')
                            }
                          >
                            <i className="fa fa-thumbs-down"></i>
                          </button>
                        </div>
                        <hr />

                        {post.comments.length > 0
                          ? post.comments.map((comment, index) => (
                              <div key={index} className="media-block">
                                <a className="media-left" href="#/">
                                  <img
                                    className="img-circle img-sm"
                                    alt="Profile Picture"
                                    src="https://bootdey.com/img/Content/avatar/avatar2.png" // Đây là avatar mẫu, thay thế bằng avatar thực tế nếu có
                                  />
                                </a>
                                <div className="media-body">
                                  <div className="mar-btm">
                                    <a
                                      href="#/"
                                      className="btn-link text-semibold media-heading box-inline"
                                    >
                                      {comment.user} {/* Tên người dùng */}
                                    </a>
                                    {/* Thêm thời gian hoặc thông tin khác nếu cần */}
                                  </div>
                                  <p>{comment.text}</p>
                                  {showReplyInput[comment.comment_id] && (
                                    <form
                                      onSubmit={(e) => {
                                        e.preventDefault();
                                        handleAddReply(
                                          post.post_id,
                                          comment.comment_id
                                        );
                                      }}
                                      className="input-group"
                                    >
                                      <input
                                        type="text"
                                        value={
                                          replies[comment.comment_id] || ''
                                        }
                                        onChange={(e) =>
                                          setReplies({
                                            ...replies,
                                            [comment.comment_id]:
                                              e.target.value,
                                          })
                                        }
                                        placeholder="Add a reply"
                                        className="form-control"
                                      />
                                      <div className="input-group-btn">
                                        <button
                                          className="btn btn-primary"
                                          type="submit"
                                        >
                                          <i className="fa fa-paper-plane"></i>
                                        </button>
                                      </div>
                                    </form>
                                  )}
                                  <button
                                    className="btn btn-sm btn-default"
                                    type="button"
                                    onClick={() =>
                                      toggleReplyInput(comment.comment_id)
                                    }
                                  >
                                    <i className="fa fa-reply fa-fw"></i> Reply
                                  </button>
                                  {/* Các nút tương tác hoặc thông tin khác */}
                                </div>

                                {comment.replies &&
                                  comment.replies.length > 0 && (
                                    <div>
                                      <p
                                        onClick={() =>
                                          handleToggleReplies(
                                            comment.comment_id
                                          )
                                        }
                                      >
                                        {openReplyId === comment.comment_id ? (
                                          <a>Ẩn câu trả lời</a>
                                        ) : (
                                          <a>Xem câu trả lời</a>
                                        )}
                                      </p>
                                      {openReplyId === comment.comment_id &&
                                        comment.replies.map((reply, index) => (
                                          <div key={index}>
                                            <p>
                                              <div className="info-reply">
                                                <a
                                                  className="media-left"
                                                  href="#/"
                                                >
                                                  <img
                                                    className="img-circle img-sm"
                                                    alt="Profile Picture"
                                                    src="https://bootdey.com/img/Content/avatar/avatar1.png"
                                                  />
                                                </a>
                                                <div>
                                                  <a
                                                    href="#/"
                                                    style={{ fontSize: '20px' }}
                                                    className="btn-link text-semibold media-heading box-inline"
                                                  >
                                                    {reply.user}
                                                  </a>
                                                  <p>{reply.text}</p>
                                                </div>
                                              </div>
                                            </p>
                                          </div>
                                        ))}
                                    </div>
                                  )}
                                <hr />
                              </div>
                            ))
                          : null}
                      </div>
                    </div>

                    <div className="media-block pad-all">
                      <input
                        type="text"
                        value={comments[post.post_id] || ''}
                        onChange={(e) =>
                          setComments({
                            ...comments,
                            [post.post_id]: e.target.value,
                          })
                        }
                        placeholder="Add a comment"
                        className="form-control"
                        style={{ marginTop: '10px' }}
                      />
                      <button
                        className="btn btn-sm btn-primary pull-right"
                        type="submit"
                        onClick={() => handleAddComment(post.post_id)}
                        style={{ marginTop: '10px' }}
                      >
                        <i className="fa fa-pencil fa-fw"></i>
                        Submit Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BasePageContainer>
  );
};

export default Dashboard;
