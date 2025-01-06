import clsx from 'clsx';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '@/providers';

export default function GoogleButton() {
  const { login } = useAuth();
  async function loginHandler() {
    await login('google');
  }

  return (
    <button
      type="button"
      className={clsx(
        'h-10 w-full',
        'rounded-md',
        'cursor-pointer',
        'flex justify-center items-center',
        'font-medium text-on-background',
        'border border-on-background',
        'hover:bg-on-background hover:text-background',
        'transition-colors duration-150',
      )}
      onClick={loginHandler}
    >
      <FontAwesomeIcon icon={faGoogle} className="mr-2" />
      Continue with Google
    </button>
  );
}
