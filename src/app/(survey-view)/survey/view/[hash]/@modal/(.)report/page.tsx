import Report from '@components/template/Report';
import { Modal } from './modal';

interface PageProps {}
const Page: React.FC<PageProps> = () => {
  return (
    <Modal>
      <Report modal />
    </Modal>
  );
};

export default Page;
