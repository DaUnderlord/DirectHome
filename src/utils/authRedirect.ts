import { UserRole } from '../types/auth';

export function getPostLoginPath(role: UserRole, redirect?: string | null): string {
  if (redirect === 'list-property') return '/owner/properties/new';
  if (redirect === 'dashboard') return '/dashboard';

  switch (role) {
    case UserRole.HOME_OWNER:
      return '/dashboard/homeowner';
    case UserRole.ADMIN:
      return '/admin';
    case UserRole.HOME_SEEKER:
    default:
      return '/dashboard/homeseeker';
  }
}
