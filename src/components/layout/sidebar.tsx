import { webRoutes } from '../../routes/web';
import { BiHomeAlt2 } from 'react-icons/bi';
import Icon, {
  UserOutlined,
  InfoCircleOutlined,
  ScanOutlined,
} from '@ant-design/icons';

export const sidebar = [
  {
    path: webRoutes.dashboard,
    key: webRoutes.dashboard,
    name: 'Dashboard',
    icon: <Icon component={BiHomeAlt2} />,
  },
  {
    path: webRoutes.predict,
    key: webRoutes.predict,
    name: 'Predict',
    icon: <ScanOutlined />,
  },
  {
    path: webRoutes.users,
    key: webRoutes.users,
    name: 'Users',
    icon: <UserOutlined />,
  },
  {
    path: webRoutes.about,
    key: webRoutes.about,
    name: 'About',
    icon: <InfoCircleOutlined />,
  },
];
