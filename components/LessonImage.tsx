import Image from 'next/image';

/**
 * LessonImage Component
 * 
 * NEXT.JS CONCEPT:
 * The `next/image` component extends the native `<img>` element with features 
 * for excellent web performance. It automatically optimizes images (WebP/AVIF), 
 * prevents Cumulative Layout Shift (CLS) by requiring dimensions (or `fill`), 
 * and lazy loads by default.
 */
export default function LessonImage({ altText = "Next.js Mastery Banner" }: { altText?: string }) {
  return (
    <div className="relative w-full h-[250px] sm:h-[350px] mb-10 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800">
      <Image
        src="/images/banner.png"
        alt={altText}
        fill
        priority // We use priority because this image is "above the fold" (LCP element)
        sizes="(max-width: 896px) 100vw, 896px"
        className="object-cover"
      />
    </div>
  );
}
