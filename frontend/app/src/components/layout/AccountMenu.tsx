import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { useAuth } from '../../features/auth/authContext';
import { messages } from '../../i18n/pt-BR';

export function AccountMenu() {
  const { username, logout } = useAuth();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={messages.account.label}
          className="flex items-center gap-2 rounded-xl bg-surface-container-low px-3 py-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
        >
          <span className="material-symbols-outlined text-xl" aria-hidden="true">
            account_circle
          </span>
          <span className="hidden max-w-32 truncate sm:block">{username}</span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-48 rounded-xl bg-surface-container-high p-2 shadow-2xl"
        >
          <DropdownMenu.Label className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            {username}
          </DropdownMenu.Label>
          <DropdownMenu.Separator className="my-1 h-px bg-outline-variant/20" />
          <DropdownMenu.Item
            onSelect={logout}
            className="cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold text-on-surface outline-none transition-colors data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary"
          >
            {messages.account.signOut}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
