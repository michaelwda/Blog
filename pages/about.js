import Layout from '@components/Layout';

const About = ({ title, description, ...props }) => {
  return (
    <>
      <Layout pageTitle={`${title} | About`} description={description}>
        <h1 className="title">About Me</h1>
        <img src="/static/me.jpg" alt="me" /> 
        
        <article>
          I'm a software developer and consultant living in Cary, North Carolina. I work for a small consulting firm based out of Clemmons, North Carolina. We have clients all over the state. 
          As a software consultant for a local firm, I have had the opportunity to work with different technologies and to solve a variety of unique problems. Working directly with clients has allowed me to take on multiple roles within the project life cycle including, but not limited to, business problem analysis, system design, project management, and full-stack software implementation.

          <h2>Skills</h2>
          <i>I would consider these primary skills, but it's not unusual for me to navigate a wide-variety of code. This would include PHP, Bash, Python, and even RPG. </i>
          
            <table>
              <tbody>
              <tr>
                <td className='skillCategory'>Languages</td><td>Java, C#, HTML, CSS, JavaScript</td>
              </tr>
              <tr>
                <td className='skillCategory'>Databases</td><td>MS-SQL (SSMS, SSIS, SSRS), MySql, DB2</td>
              </tr>
              <tr>
                <td className='skillCategory'>Frameworks</td><td>.NET Core, Spring Boot, ORMs (Dapper, Entity Framework, Hibernate)</td>
              </tr>
              <tr>
                <td className='skillCategory'>Mobile</td><td>Native IOS and Android development, cross-platform Xamarin</td>
              </tr>
              <tr>
                <td className='skillCategory'>Cloud</td><td>Azure (App Service, SQL, Storage), AWS (EC2, RDS, S3, SES)</td>
              </tr>
              <tr>
                <td className='skillCategory'>Other</td><td>TDD, CI/CD, Git</td>
              </tr>
              </tbody>
            </table>       
        </article>
      </Layout>
      <style jsx>{`
        article {
          margin-top: 20px;
          width: 100%;
          max-width: 1200px;
        } 
        td {         
          padding:5px;
        }       
        .skillCategory {
          font-weight: 800;
        }
      `}</style>
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