import { Metadata } from 'next'
import { BRAND_NAME } from '@common/variables'

interface PageMetadataProps {
  title?: string
  description?: string
  keywords?: string[]
  path?: string
  image?: string
  noIndex?: boolean
}

export function generatePageMetadata({
  title,
  description,
  keywords = [],
  path = '',
  image,
  noIndex = false,
}: PageMetadataProps): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
  const fullTitle = title ? `${title} | ${BRAND_NAME}` : `${BRAND_NAME} - 빠르고 간편한 설문 플랫폼`
  const fullDescription = description || '설문을 쉽고 빠르게 생성하고 관리하세요. 직관적인 인터페이스로 누구나 쉽게 설문을 만들고 응답을 분석할 수 있습니다.'
  const fullImage = image || `${siteUrl}/nuvia_logo_with_text.png`
  const canonicalUrl = `${siteUrl}${path}`

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: ['설문', '설문조사', '폼', '데이터 수집', '응답 분석', '온라인 설문', ...keywords],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      type: 'website',
      locale: 'ko_KR',
      url: canonicalUrl,
      siteName: BRAND_NAME,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: [fullImage],
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  }
}

