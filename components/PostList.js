import Link from 'next/link'

export default function PostList({ posts }) {
  if (posts === 'undefined') return null

  return (
    <>
    <div>
      {!posts && <div>No posts!</div>}
      <ul>
      {posts &&
          posts.map((post) => {
            return (
              <li key={post.slug}>
                <div className="postDate">
                  {post.date}
                </div>
                <div className="postBody">
                  <Link href="/post/[postname]" as={`/post/${post.slug}`}>
                    <a>{post?.frontmatter?.title}</a>
                  </Link>
                </div>
              </li>
            )
          })
          }
      </ul>
    </div>
    <style jsx>{`
         ul {
          list-style-type: none;
          padding:0;
        }
        li {
          display: flex;
          align-items: flex-start;
          background: #FFF;
          padding-bottom:1rem;
          border-bottom: 1px dashed black;
          margin: 0 0 1rem 0;
        }
        li > .postDate {
          margin: 0 1rem 0 0;
          font-size: 1rem;
          font-style: italic
        }
        li > .postBody {
          flex: 1;
          align-items: flex-end;
        }


    `}
    </style>
    </>
  )
}