import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import type { To } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { HomeIcon } from '@heroicons/react/24/outline';

type NavigationLinkProps = {
  path: To;
  caption: ReactNode | string;
  icon: ReactNode;
};

export function NavigationLink(props: NavigationLinkProps): ReactNode {
  const { path, caption, icon } = props;

  return (
    <Button variant="link" className="w-full justify-start text-left">
      {icon}
      <NavLink
        aria-label={`Navigate ${caption}`}
        role="listitem"
        to={path}
        className={({ isActive }) =>
          isActive
            ? 'text-blue-600 font-semibold underline'
            : 'text-gray-700 hover:text-blue-500'
        }
      >
        {caption}
      </NavLink>
    </Button>
  );
}

export const Navigation = () => {
  const { t } = useTranslation();

  return (
    <nav aria-label="Navigation Menu" role="list">
      <NavigationLink path="/" caption={t('dashboard')} icon={<HomeIcon />} />
    </nav>
  );
};
