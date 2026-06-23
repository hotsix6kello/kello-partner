import type { Metadata } from "next";
import { notFound } from "next/navigation";
import styles from "../../portal.module.css";
import { getLegalDocument, legalDocumentSlugs } from "../legalDocuments";

type LegalPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return legalDocumentSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const document = getLegalDocument(slug);

  if (!document) {
    return {};
  }

  return {
    title: `${document.title} | Kello 파트너`,
  };
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { slug } = await params;
  const document = getLegalDocument(slug);

  if (!document) {
    notFound();
  }

  return (
    <article className={styles.legalPage}>
      <header className={styles.legalHeader}>
        <span className={styles.legalEyebrow}>Legal</span>
        <h2 className={styles.legalTitle}>{document.title}</h2>
        <span className={styles.legalEffectiveDate}>시행일: {document.effectiveDate}</span>
      </header>

      <div className={styles.legalDocument}>
        {document.content.split("\n\n").map((block) => (
          <p key={block} className={styles.legalBlock}>
            {block}
          </p>
        ))}
      </div>
    </article>
  );
}
