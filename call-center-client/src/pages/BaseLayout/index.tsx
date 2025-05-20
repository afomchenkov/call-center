import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Bars3Icon,
  SunIcon,
  MoonIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Navigation } from '@/components/Navigation';
import { useLog, useThemeSwitch } from '@/hooks';

function SwitchTranslation() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer mx-3">
        <GlobeAltIcon className="w-7 h-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => changeLanguage('en')}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('de')}>
          German
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SwitchThemeButton() {
  const [activeTheme, setTheme] = useThemeSwitch();

  return (
    <Button
      variant="outline"
      className="cursor-pointer sm"
      size="icon"
      onClick={() => setTheme(activeTheme)}
    >
      {activeTheme === 'dark' ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
}

function Sidebar(): ReactNode {
  return (
    <div className="flex flex-col h-full">
      <Navigation />
    </div>
  );
}

export function BaseLayout(): ReactNode {
  const { consoleError } = useLog();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 flex items-center justify-between px-4 py-3 shadow">
        <h1 className="text-lg font-semibold">{t('callCenter')}</h1>

        <div className="flex px-2">
          <SwitchTranslation />
          <SwitchThemeButton />
        </div>

        {/* Mobile sidebar toggle */}
        <div className="sm:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Bars3Icon className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-2 w-50">
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex flex-1">
        {/* Static sidebar for larger screens */}
        <aside className="hidden sm:flex w-50 flex-col border-r p-4">
          <Sidebar />
        </aside>

        {/* Main content */}
        <ErrorBoundary
          fallback={<div>Something went wrong.</div>}
          onError={consoleError}
        >
          <main className="flex-1 p-4 overflow-auto" role="main">
            {/* Routed page content */}
            <Outlet />
          </main>
        </ErrorBoundary>
      </div>
    </div>
  );
}
