import { Inter, Roboto } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const roboto = Roboto({ subsets: ['latin'], weight: '400' });

const font = {
  inter,
  roboto,
};

export default font;
