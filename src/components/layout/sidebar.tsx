import { webRoutes } from '../../routes/web';
import { BiHomeAlt2 } from 'react-icons/bi';
import Icon, {
  InfoCircleOutlined,
  ScanOutlined,
  HistoryOutlined,
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
    path: webRoutes.history,
    key: webRoutes.history,
    name: 'History',
    icon: <HistoryOutlined />,
  },
  {
    path: webRoutes.about,
    key: webRoutes.about,
    name: 'About',
    icon: <InfoCircleOutlined />,
  },
];
