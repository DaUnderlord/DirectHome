import { UserRole } from '../types/auth';

function isSafeInternalPath(redirect?: string | null): redirect is string {
  if (!redirect || redirect.length > 300) return false;
  if (!redirect.startsWith('/')) return false;
  if (redirect.startsWith('//') || redirect.includes('\\') || redirect.includes('://')) {
    return false;
  }
  return true;
}

export function getPostLoginPath(role: UserRole, redirect?: string | null): string {
  if (redirect === 'list-property') return '/owner/properties/new';
  if (redirect === 'dashboard') return '/dashboard';
  if (isSafeInternalPath(redirect)) return redirect;

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
