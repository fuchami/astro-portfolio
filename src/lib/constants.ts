import type { z } from 'astro/zod';
import MetaDefaultImage from '@/assets/images/meta-default.jpg';
import avatar from '@/assets/images/icon.png';
import type { seoSchemaWithoutImage } from '@/content.config';
import astroConfig from 'astro.config.mjs';

export type AuthorInfo = {
  name: string;
  avatar: any;
  headline: string;
  username?: string;
  location?: string;
  pronouns?: string;
};

export type Seo = z.infer<typeof seoSchemaWithoutImage> & {
  image?: any;
};

type DefaultConfigurationType = {
  baseUrl: string;
  author: AuthorInfo;
  seo: Seo;
};

export const DEFAULT_CONFIGURATION: DefaultConfigurationType = {
  baseUrl: astroConfig.site || 'https://getcvfolio.com',
  author: {
    avatar,
    name: 'Yuki Futami',
    headline: 'ML/MLOps Engineer',
    username: 'fuchami',
    location: 'Japan',
    pronouns: '',
  },
  seo: {
    title: 'fuchami portfolio & Blog',
    description: 'portfolio website',
    type: 'website',
    image: MetaDefaultImage,
    twitter: {
      creator: '@__fuchami__',
    },
    robots: 'noindex, nofollow',
  },
};
