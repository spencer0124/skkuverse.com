import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return [{ slug: "placeholder" }];
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: decodeURIComponent(slug),
  };
}

export default async function NoticeDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  return (
    <>
      <Header />
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-[800px] px-6">
          <h1 className="text-display font-bold text-grey-900">
            {decodeURIComponent(slug)}
          </h1>
        </div>
      </main>
      <Footer />
    </>
  );
}
