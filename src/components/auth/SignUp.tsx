import { Button, Form, Input } from 'antd';
import { Fragment, useState, useEffect } from 'react';
import { setPageTitle } from '../../utils';
import { signup } from '../../api/auth';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { webRoutes } from '../../routes/web';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const SingUp = () => {
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const from = location.state?.from?.pathname || webRoutes.login;
  const admin = useSelector((state: RootState) => state.admin);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    setPageTitle('Sign Up');
  }, []);
  useEffect(() => {
    if (admin) {
      navigate(from, { replace: true });
    }
  }, [admin]);
  const handleSubmit = async (event: React.FormEvent) => {
    setLoading(true);
    event.preventDefault();
    const response = await signup(username, email, password);
    if (response) {
      toast.success('Sign Up Sccessfuly');

      navigate(from, { replace: true });
      console.log(response);
    }
  };

  return (
    <Fragment>
      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-left text-opacity-30 tracking-wide">
        SignUp
      </h1>
      <Form
        className="space-y-4 md:space-y-6"
        form={form}
        name="singup"
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
                type: 'email',
                message: 'Invalid email address',
              },
            ]}
          >
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
              className="bg-gray-50 text-gray-900 sm:text-sm py-1.5"
            />
          </Form.Item>
        </div>
        <div>
          <Form.Item
            name="username"
            label={
              <p className="block text-sm font-medium text-gray-900">
                UserName
              </p>
            }
            rules={[
              {
                required: true,
                message: 'Please enter your username',
              },
            ]}
          >
            <Input
              type="string"
              placeholder="Nhập User"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            onClick={handleSubmit}
            loading={loading}
            type="primary"
            size="large"
            htmlType={'submit'}
          >
            SignUp
          </Button>
        </div>
      </Form>
    </Fragment>
  );
};
export default SingUp;
