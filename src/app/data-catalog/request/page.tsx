import type { Metadata } from 'next';
import Header from '@/app/components/layout/Header';
import Footer from '@/app/components/sections/Footer';
import RequestFormClient from './RequestFormClient';

export const metadata: Metadata = {
  title: 'Request Access | Claru Data Catalog',
  description:
    'Request access to Claru\'s curated AI training data catalog. Tell us about your project and data needs.',
};

export default function RequestAccessPage() {
  return (
    <>
      <Header opaque />
      <main className="min-h-screen bg-[var(--bg-primary)] pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-3 font-[family-name:var(--font-geist-sans)]">
            Request Catalog Access
          </h1>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base font-mono">
            Fill out the form below and we will review your request within 24
            hours.
          </p>
        </div>

        <RequestFormClient />
      </main>
      <Footer />
    </>
  );
}
