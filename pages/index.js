import Layout from '@components/Layout';
import PostList from '@components/PostList';
import getPosts from '@utils/getPosts';

const Home = ({title, description, posts, ...props}) => {
  return (
    <>
      <Layout pageTitle={title} description={description}>
        <h1 className="title">Michael Davis</h1>
        <p className="subtitle">Software Engineer and Consultant</p>
        <p className="description">
          {description}
        </p>
        <main>
          <PostList posts={posts} />
        </main>
      </Layout>
    </>
  )
}

export default Home

export async function getStaticProps() {
  const configData = await import(`../siteconfig.json`)

  const posts = ((context) => {
    return getPosts(context)
  })(require.context('../posts', true, /\.md$/))

  return {
    props: {
      posts,
      title: configData.default.title,
      description: configData.default.description,
    },
  }
}