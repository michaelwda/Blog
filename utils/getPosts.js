import matter from 'gray-matter'

const getPosts = (context) => {
  const keys = context.keys()
  const values = keys.map(context)

  const data = keys.map((key, index) => {
    let slug = key.replace(/^.*[\\\/]/, '').slice(0, -3)
    const value = values[index]
    const document = matter(value.default)
    return {
      frontmatter: document.data,
      markdownBody: document.content,
      slug,
      date: document.data.date,
      published: document.data.published
    }
  }).filter(post=>post.published).sort((b, a) => (a.date > b.date && 1) || (a.date === b.date ? 0 : -1))
  return data
}

export default getPosts