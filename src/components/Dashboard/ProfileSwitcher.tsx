import React, { useState } from 'react';
import { IconHome, IconSearch } from '@tabler/icons-react';
import { UserRole } from '../../types/auth';

interface ProfileSwitcherProps {
  activeRole: UserRole;
  onSwitch: (role: UserRole) => Promise<void>;
}

const OPTIONS = [
  {
    role: UserRole.HOME_OWNER,
    label: 'Home owner',
    description: 'List and manage your properties',
    icon: IconHome,
  },
  {
    role: UserRole.HOME_SEEKER,
    label: 'Home seeker',
    description: 'Search and save homes to rent',
    icon: IconSearch,
  },
];

/** Lets a signed-in user switch their profile between home owner and home seeker. */
const ProfileSwitcher: React.FC<ProfileSwitcherProps> = ({ activeRole, onSwitch }) => {
  const [busyRole, setBusyRole] = useState<UserRole | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSwitch = async (role: UserRole) => {
    if (role === activeRole || busyRole) return;
    setError(null);
    setBusyRole(role);
    try {
      await onSwitch(role);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not switch profile. Try again.');
    } finally {
      setBusyRole(null);
    }
  };

  return (
    <section className="border border-paper-200 bg-paper-50 p-4 sm:p-5" aria-label="Switch profile">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-[11px] tracking-[0.28em] uppercase text-courtyard-700 font-semibold">
            Profile
          </p>
          <p className="text-sm text-ink-600 mt-1">Switch between your home owner and home seeker profiles.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:w-auto" role="radiogroup">
          {OPTIONS.map((option) => {
            const Icon = option.icon;
            const active = option.role === activeRole;
            const busy = busyRole === option.role;
            return (
              <button
                key={option.role}
                type="button"
                role="radio"
                aria-checked={active}
                disabled={Boolean(busyRole)}
                onClick={() => void handleSwitch(option.role)}
                title={option.description}
                className={`min-h-11 px-4 py-2 flex items-center justify-center gap-2 border text-sm font-semibold transition-colors disabled:opacity-60 ${
                  active
                    ? 'border-courtyard-700 bg-courtyard-700 text-paper-50'
                    : 'border-paper-300 text-ink-800 hover:border-courtyard-500 hover:bg-paper-100'
                }`}
              >
                <Icon size={18} />
                {busy ? 'Switching…' : option.label}
              </button>
            );
          })}
        </div>
      </div>
      {error && <p className="mt-3 text-sm text-laterite-600">{error}</p>}
    </section>
  );
};

export default ProfileSwitcher;
