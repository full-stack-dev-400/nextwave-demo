import { defineQuery } from "next-sanity";

export const POSTS_QUERY = defineQuery(`
  *[
    _type == "post" &&
    defined(slug.current) &&
    defined(publishedAt)
  ]
  | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    updatedAt,
    mainImage {
      asset,
      alt
    },
    author->{
      name
    },
    categories[]->{
      _id,
      title
    },
    seo {
      metaTitle,
      metaDescription,
      focusKeyword,
      canonicalUrl,
      noIndex
    }
  }
`);

export const POST_QUERY = defineQuery(`
  *[
    _type == "post" &&
    slug.current == $slug
  ][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    updatedAt,

    mainImage {
      asset,
      alt
    },

    author->{
      name,
      image
    },

    categories[]->{
      _id,
      title
    },

    body,

    relatedPosts[]->{
      _id,
      title,
      "slug": slug.current,
      excerpt,
      mainImage {
        asset,
        alt
      }
    },

    seo {
      metaTitle,
      metaDescription,
      focusKeyword,
      canonicalUrl,
      noIndex,
      ogImage {
        asset,
        alt
      }
    }
  }
`);

export const SITEMAP_POSTS_QUERY = defineQuery(`
  *[
    _type == "post" &&
    defined(slug.current) &&
    defined(publishedAt) &&
    seo.noIndex != true
  ]
  | order(publishedAt desc) {
    "slug": slug.current,
    publishedAt,
    updatedAt
  }
`);
