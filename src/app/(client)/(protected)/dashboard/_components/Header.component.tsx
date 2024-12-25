import Image from 'next/image';
import clsx from 'clsx';
import workspaceIcon from '@/assets/images/workspace-icon.webp';

export default function Header() {
  return (
    <header className={clsx('flex items-center', 'p-8')}>
      <div className={clsx('size-15', 'rounded-md overflow-hidden')}>
        <Image
          width={60}
          height={60}
          src={workspaceIcon.src}
          alt="workspace-icon"
        />
      </div>
      <h1 className={clsx('text-xl font-semibold', 'ml-4')}>Workspace</h1>
    </header>
  );
}
