// import { useEffect, useState } from 'react';
import BasePageContainer from '../layout/PageContainer';
import { BreadcrumbProps } from 'antd';
import { webRoutes } from '../../routes/web';
import { Link } from 'react-router-dom';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { createPost, getAllPosts } from '../../api/post';
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
  // const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [selectedName, setSelectedName] = useState('');

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Cập nhật kiểu của state
  // const [selectedFile, setSelectedFile] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

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
  const openModal = (imageSrc: string) => {
    setCurrentImage(imageSrc);
    setModalIsOpen(true);
  };
  const handleIconClick = () => {
    setShowUploadForm(!showUploadForm);
  };
  const closeModal = () => {
    setModalIsOpen(false);
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
  return (
    <BasePageContainer breadcrumb={breadcrumb} transparent={true}>
      <div>
        <link
          href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"
          rel="stylesheet"
        />
        <div className="container bootdey">
          {modalIsOpen && (
            <div className="modal" onClick={closeModal}>
              <span className="close">&times;</span>
              <img
                className="modal-content"
                src={currentImage || ''}
                alt="Full Size"
              />
            </div>
          )}
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
                          )}{' '}
                          {/* Hiển thị ảnh xem trước */}
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
                {/* Hiển thị các chi tiết khác của bài viết nếu cần */}

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
                                onClick={() => openModal(post.image_url)}
                                style={{ cursor: 'pointer' }} // Tùy chọn: thay đổi con trỏ để cho người dùng biết có thể nhấp vào ảnh
                              />
                            </div>
                          )}
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
                          <a
                            className="btn btn-sm btn-default btn-hover-primary"
                            href="#/"
                          >
                            Comment
                          </a>
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
                                  {/* Các nút tương tác hoặc thông tin khác */}
                                </div>
                                <hr />
                              </div>
                            ))
                          : null}
                      </div>
                    </div>

                    <div className="media-block pad-all">
                      <a className="media-left" href="#/">
                        <img
                          className="img-circle img-sm"
                          alt="Profile Picture"
                          src="https://bootdey.com/img/Content/avatar/avatar1.png"
                        />
                      </a>
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
