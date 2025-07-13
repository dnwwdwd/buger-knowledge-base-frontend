import path from 'node:path';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

const root = path.resolve(__dirname, '../../');

export default function createSvgIcon(isBuild: boolean) {
  return createSvgIconsPlugin({
    iconDirs: [
      path.join(root, 'src/assets/icons/svg'),
      path.join(root, 'src/assets/icons/Buildings'),
      path.join(root, 'src/assets/icons/Business'),
      path.join(root, 'src/assets/icons/Device'),
      path.join(root, 'src/assets/icons/Document'),
      path.join(root, 'src/assets/icons/Others'),
      path.join(root, 'src/assets/icons/System'),
      path.join(root, 'src/assets/icons/User'),
    ],
    symbolId: 'icon-[dir]-[name]',
    svgoOptions: isBuild,
  });
}
