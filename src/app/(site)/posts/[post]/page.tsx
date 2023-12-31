import React from "react";
import { getPost } from "../../../../../sanity/utils/post";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "../../../../../sanity/lib/urlFor";
import { client } from "../../../../../sanity/lib/client";
import { groq } from "next-sanity";
import { Post } from "@/types/Post";

type Props = {
  params: {
    post: string;
  };
};

export const revalidate = 30; // revalidate this page every 30 seconds

export async function generateStaticParams() {
  const data: Post[] = await client.fetch(groq`*[_type == "post"]{
    "slug": slug.current,
  }`);

  return data.map((post) => ({
    params: { slug: post.slug },
  }));
}

export default async function PostPage({ params }: Props) {
  const slug = params.post;
  const post = await getPost(slug);

  const RichTextComponents = {
    types: {
      image: ({ value }: any) => (
        <Image
          src={urlFor(value).url()}
          alt={value.imageUrl}
          className="object-contain"
          width={500}
          height={300}
        />
      ),
    },
    list: {
      // Ex. 1: customizing common list types
      bullet: ({ children }: any) => (
        <ul className="mt-xl list-disc">{children}</ul>
      ),
      number: ({ children }: any) => (
        <ol className="mt-lg list-decimal">{children}</ol>
      ),

      // Ex. 2: rendering custom lists
      checkmarks: ({ children }: any) => (
        <ol
          className="m-auto text-lg
        "
        >
          {children}
        </ol>
      ),
    },
    block: {
      // Ex. 1: customizing common block types
      h1: ({ children }: any) => <h1 className="text-4xl">{children}</h1>,
      h2: ({ children }: any) => (
        <h2 className="text-3xl mt-8 mb-2">{children}</h2>
      ),
      h3: ({ children }: any) => (
        <h3 className="text-2xl mt-6 mb-2">{children}</h3>
      ),
      h4: ({ children }: any) => <h4 className="text-xl">{children}</h4>,
      h5: ({ children }: any) => <h5 className="text-[19px]">{children}</h5>,
      h6: ({ children }: any) => <h6 className="text-lg">{children}</h6>,
      normal: ({ children }: any) => <p className="text-md p-1">{children}</p>,
      intro: ({ children }: any) => (
        <p className="text-2xl mt-8 mb-4">{children}</p>
      ),
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-purple-500">{children}</blockquote>
      ),
      // Ex. 2: rendering custom styles
      customHeading: ({ children }: any) => (
        <h2 className="text-lg text-primary text-purple-700">{children}</h2>
      ),
    },
    marks: {
      italic: ({ children }: any) => <em className="italic">{children}</em>,
      bold: ({ children }: any) => (
        <strong className="font-bold">{children}</strong>
      ),
      underline: ({ children }: any) => <u className="underline">{children}</u>,
      code: ({ children }: any) => (
        <code className="bg-gray-100">{children}</code>
      ),
      link: ({ children, value }: any) => {
        const rel = !value.href.startsWith("/")
          ? "noreferrer noopener"
          : undefined;
        return (
          <a href={value.href} rel={rel}>
            {children}
          </a>
        );
      },
    },
  };
  return (
    <div>
      <header className="flex items-center justify-between">
        <h1 className="bg-gradient-to-r from-[#EB725A] via-[#EF4168] to-[#81CCA5] bg-clip-text text-transparent text-5xl drop-shadow font-extrabold">
          {post.name}
        </h1>
        {/* <a
          href={post.url}
          title="View post"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-100 rounded-lg text-gray-500 font-bold py-3 px-4 whitespace-nowrap hover:bg-[#EF4168] hover:text-pink-100 transition cursor-pointer"
        >
          View post
        </a> */}
      </header>

      <p className="text-gray-500">
        {new Date(post._createdAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </p>

      <Image
        src={post.image}
        alt={post.name}
        width={1920}
        height={1080}
        className="mt-10 object-cover rounded-xl max-h-[500px]"
      />

      <div className="text-lg text-gray-700 dark:text-white mt-5">
        <PortableText value={post.content} components={RichTextComponents} />
      </div>
    </div>
  );
}
