//config.ts

enum LayoutType {
  MIX = 'mix',
  TOP = 'top',
  SIDE = 'side',
}

const CONFIG = {
  appName: 'Doctor V',
  helpLink: 'https://www.belle.ai/about-us',
  enablePWA: true,
  theme: {
    accentColor: '#818cf8',
    sidebarLayout: LayoutType.MIX,
    showBreadcrumb: true,
  },
  metaTags: {
    title: 'Doctor V',
    description: 'Join hands for a better life',
    imageURL: 'logo.svg',
  },
};

export default CONFIG;
