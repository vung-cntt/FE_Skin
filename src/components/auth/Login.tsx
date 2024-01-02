import { Button, Form, Input } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { auth } from '../../api/auth';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useLocation, useNavigate } from 'react-router-dom';
import { webRoutes } from '../../routes/web';
import { setPageTitle } from '../../utils';
import { login } from '../../store/slices/adminSlice';
import { toast } from 'sonner';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || webRoutes.dashboard;
  const admin = useSelector((state: RootState) => state.admin);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    setPageTitle('Admin Login');
  }, []);

  useEffect(() => {
    if (admin) {
      navigate(from, { replace: true });
    }
  }, [admin]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const data = await auth(username, password);
      console.log(data);

      // Xử lý dữ liệu đăng nhập tại đây
      // Ví dụ: Lưu token vào Redux store

      dispatch(login({ token: data.access_token }));
      localStorage.setItem('accessToken', data.access_token);
      localStorage.setItem('uid', data.idUser);
      toast.success('Login Sccessfuly');

      navigate(from, { replace: true });
    } catch (error) {
      console.error('An error occurred during login:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleSignUp = () => {
    // Chuyển hướng đến trang Sign Up khi nhấn nút "Sign Up"
    navigate(webRoutes.signup);
  };
  return (
    <Fragment>
      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-left text-opacity-30 tracking-wide">
        Login
      </h1>
      <Form
        className="space-y-4 md:space-y-6"
        form={form}
        name="login"
        layout={'vertical'}
        requiredMark={false}
      >
        <div>
          <Form.Item
            name="email"
            label={
              <p className="block text-sm font-medium text-gray-900">Email</p>
            }
            rules={[
              {
                required: true,
                message: 'Please enter your email',
              },
              {
                type: 'string',
                message: 'Invalid email address',
              },
            ]}
          >
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="bg-gray-50 text-gray-900 sm:text-sm py-1.5"
            />
          </Form.Item>
        </div>
        <div>
          <Form.Item
            name="password"
            label={
              <p className="block text-sm font-medium text-gray-900">
                Password
              </p>
            }
            rules={[
              {
                required: true,
                message: 'Please enter your password',
              },
            ]}
          >
            <Input.Password
              type="password"
              placeholder="••••••••"
              visibilityToggle={false}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 text-gray-900 sm:text-sm py-1.5"
            />
          </Form.Item>
        </div>

        <div className="text-center">
          <Button
            className="mt-4 bg-primary"
            block
            onClick={handleLogin}
            loading={loading}
            type="primary"
            size="large"
            htmlType={'submit'}
          >
            Login
          </Button>

          <Button
            className="mt-4 bg-primary"
            block
            onClick={handleSignUp}
            type="primary"
            size="large"
            htmlType={'submit'}
          >
            Sign Up
          </Button>
        </div>
      </Form>
    </Fragment>
  );
};

export default Login;
