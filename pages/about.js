import Layout from '@components/Layout';

const About = ({ title, description, ...props }) => {
  return (
    <>
      <Layout pageTitle={`${title} | About`} description={description}>
        <h1 className="title">About Me</h1>
        <img src="/static/me.jpg" alt="me" /> 
        <p className="description">
        
          I'm a software developer and consultant living in Cary, North Carolina. I work for a small consulting firm based out of Clemmons, North Carolina. We have clients all over the state. 
        </p>
        <p>
        I've had amazing opportunities to work with different technologies and business problems since getting started in 2009. My goals for this site are simply to share interesting things I run into or do.
        </p>
      </Layout>
    </>
  )
}


export default About

export async function getStaticProps() {
  const configData = await import(`../siteconfig.json`)

  return {
    props: {
      title: configData.default.title,
      description: configData.default.description,
    },
  }
}