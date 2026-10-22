import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,

  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description:
        'Short summary shown on the blog listing page and used as a fallback for SEO description.',
      validation: (rule) =>
        rule.required().max(200),
    }),

    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'},
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'mainImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description:
            'Describe the image clearly for accessibility and image SEO.',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: {type: 'category'},
        }),
      ],
    }),

    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime',
      description:
        'Update this when the article is significantly changed.',
    }),

    defineField({
      name: 'body',
      title: 'Article Content',
      type: 'blockContent',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'relatedPosts',
      title: 'Related Posts',
      type: 'array',
      description:
        'Optional posts to show at the bottom of the article.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'post'}],
        }),
      ],
      validation: (rule) => rule.max(3),
    }),

    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: false,
      },

      fields: [
        defineField({
          name: 'metaTitle',
          title: 'SEO Title',
          type: 'string',
          description:
            'Title used by search engines. Keep it clear and keyword focused.',
          validation: (rule) => rule.max(60),
        }),

        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description:
            'Short description shown in search results.',
          validation: (rule) => rule.max(160),
        }),

        defineField({
          name: 'focusKeyword',
          title: 'Focus Keyword',
          type: 'string',
          description:
            'Main keyword or search phrase targeted by this article.',
        }),

        defineField({
          name: 'canonicalUrl',
          title: 'Canonical URL',
          type: 'url',
          description:
            'Usually leave this empty unless the canonical URL should be different from the current article URL.',
        }),

        defineField({
          name: 'ogImage',
          title: 'Social Sharing Image',
          type: 'image',
          description:
            'Optional image used when the article is shared on social media.',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative Text',
              type: 'string',
            }),
          ],
        }),

        defineField({
          name: 'noIndex',
          title: 'Prevent Search Engine Indexing',
          type: 'boolean',
          description:
            'Enable only if you do not want this article to appear in search engines.',
          initialValue: false,
        }),
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },

    prepare(selection) {
      const {author} = selection

      return {
        ...selection,
        subtitle: author ? `by ${author}` : 'No author',
      }
    },
  },
})