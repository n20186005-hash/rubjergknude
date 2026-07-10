import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getAlternateLanguageLinks, getLocalePath, siteConfig } from '@/i18n/config';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const selfUrl = `${siteConfig.baseUrl}${getLocalePath(locale)}`;

  return {
    title: messages.meta.title,
    description: messages.meta.description,
    alternates: {
      canonical: selfUrl,
      languages: {
        ...getAlternateLanguageLinks(),
        'x-default': `${siteConfig.baseUrl}${getLocalePath('zh')}`,
      },
    },
    openGraph: {
      title: messages.meta.title,
      description: messages.meta.description,
      url: selfUrl,
      siteName: siteConfig.siteName,
      locale: siteConfig.openGraphLocale[locale as keyof typeof siteConfig.openGraphLocale],
      type: 'website',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={siteConfig.htmlLang[locale as keyof typeof siteConfig.htmlLang]} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
