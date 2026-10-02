import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/config';

// `/` is a stable entry point, not a language negotiation: it always resolves to
// the default locale (Danish) with a single redirect. Middleware handles this at
// the edge; this page is the fallback for statically served builds.
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
