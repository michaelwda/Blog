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
                <date>
                  {post.date}
                </date>
                <div>
                  <Link href={{ pathname: `/post/${post.slug}` }}>
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
        }        
        li {
          display: flex;
          align-items: flex-start;
          background: #FFF;
          padding: 1rem;
          border: 1px dashed black;
          margin: 0 0 1rem 0;
        }
        li > date {
          width: 100px;
          margin: 0 1rem 0 0;
        }
        li > div {
          flex: 1;
        }
        
        
    `}
    </style>
    </>
  )
}