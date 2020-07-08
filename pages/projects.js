import Layout from '@components/Layout';

const About = ({ title, description, ...props }) => {
  return (
    <>
      <Layout pageTitle={`${title} | Recent Projects`} description={description}>
        <h1 className="title">Recent Projects</h1>           
        <article>
          <p className="projectTitle">Backend System Modernization and Enhancements</p>
          <p className="projectClient">NC Licensing Board</p>
          <p className="projectTimeline">January 2017  – Ongoing</p>
          <p>
            Working with a North Carolina Licensing Board to modernize their internal systems. Legacy iSeries applications are being slowly rewritten into modern Java web-applications while maintaining the DB2 data backend. 
            Shortcomings in the original database are being corrected as we proceed. Public facing websites have been refreshed with modern-design and improved functionality. 
          </p>
          <p>
            In 2018, new consumer-facing portals were developed to support online license renewals, payments, and services. We launched the portal in early 2018 with a subset of services available to get users signed up ahead of time, and subsequently launched online renewals on 10/01/2018. 
            Over 22,000 renewals flowed through the online system in the first 4 months – renewals that were previously filled out by hand and mailed in.
          </p>
          <p>
            In addition to an online portal for renewals by licensees, we also built an internal workflow tool to assist the team with reviewing the online renewals. 
            Each renewal must be approved or denied before it takes effect. Our internal review tool is built into our new java web-application and allows the team to view a facsimile version of renewal application as a PDF. 
            Team-members, after checking out the renewal into their personal basket for review, can then choose to accept, deny, send-back, or reroute to another team-member.
          </p>
          <p>
            As part of this process, we also added a workbasket called Robo. This basket captured renewals that we suspected would be candidates for automatic approval. 
            Throughout the first month, we had the team work every single on of these manually to ensure we didn’t receive any false positives. Once we were certain that our implementation was correct, 
            we turned the robo-approval feature live and began automatically approving renewals that passed our criteria. Most of the renewal volume comes in December and in recent years the team has been getting inundated with 
            buckets of mail that must be sorted, scanned, and processed. With the combination of online renewals and the new robo-approval feature, we realized immense time-savings for the team that allowed them, for the first time ever, 
            to have a relaxing holiday without having to worry how far behind they were on renewals. 
          </p>
          <p>
            <b>2019</b>: We have continued to expand the new internal tooling in an effort to replace the old greenscreen interfacing. A new schema has been developed and is kept in sync (very carefully), as we transition away.
            2019 also saw the legislature pass new laws requiring CE in 2020, so new <i>provider</i> portals were developed and launched to allow schools to report CE hours.
          </p>
          <p><b>2020</b>: CE has begun, in spite of covid, and the new Education Portal is working well. Significant work is being done to make sure that the renewal process is CE aware. 
            We are also launching a new "Applicant" portal in July 2020 that will replace the existing paper application. As much as possible, we embedded validation of the business-rules and instructions into the online form itself. 
            It will be difficult to quantify the time-savings for the staff on this one, but it will prevent many classes of errors before the form is even submitted.      
          </p>
          <p>
            Tech: Java, DB2, RPG, AWS (EC2, S3, RDS-MySql, SES)
          </p>
        </article>
        <article>
          <p className="projectTitle">Municipal Revenue Enhancement</p>
          <p className="projectTimeline">January 2019 - December 2019</p>
          <p>
            Client in question assists municipalities with discovered and collecting unpaid Business License fees from businesses operating within their city. This seems like a fairly simply problem, but it gets quite complicated for a number of reasons:
            <ul>
              <li>Each municipality has different ordinances</li>  
              <li>Each may have different renewal schedules</li>
              <li>Clients in different states may have a completely different set of licenses / renewal schedules</li>
              <li>Most businesses operate in multiple municipalities</li>
              <li>Contact with businesses can only be performed at specific intervals</li>
              <li>Lots of intermediate states between first contact and payment</li>
              <li>They are also collecting renewals and need to track those too</li>
            </ul>            
          </p> 
          <p>We converted their existing homegrown access database, cleaned up all their data, and build a completely new web-application to track all work being done.</p>         
          <p>We developed complex internal reports and research tools to help identity businesses. Some of these research tools ingest printed documents, deep-indexes the content using google vision APIs / Apache Tika, and allows full-text searching.</p>
          <p>We developed a client-facing portal to allow the municipalities to view progress, report payments, and see invoices.</p>
          <p>
            Tech: .NET Core MVC, EF Core, Azure WebApps, Azure Storage, Google Vision, Apache Tika
          </p>
        </article>
        <article>
          <p className="projectTitle">CE School</p>
          <p className="projectTimeline">January 2019 - February 2020</p>
          <p>
            Working with a school to prepare for the influx of CE students in 2020. Migrated their homegrown access database to a web-application, while also streamlining several time-consuming and error prone operations.                     
          </p> 
          <p>
            <ul>
              <li>Transcripts, certification achievement, and renewal hours are calculated automatically with an algorithm. Previously these were being done by hand and it absolutely could not scale for 2020.</li>
              <li>Student and Account management screens</li>
              <li>Course setup and scheduling</li>
              <li>Online shopping cart features to allow new students to sign-up and enroll in courses - implemented with EF Core concurrency tokens to prevent overselling race-conditions</li>
              <li>Authorize.NET payment integration</li>
              <li>Automatic certicates following course completion</li>
            </ul>
          </p>         
          <p>
            Tech: .NET Core MVC, EF Core, Azure WebApps, Azure Storage
          </p>
        </article>
        <article>
          <p className="projectTitle">EMV Implementation</p>
          <p className="projectClient">Water Utility</p>
          <p className="projectTimeline">October 2018</p>
          <p>
            Replacing a client's payment gateway with an EMV implementation for card-present transactions.
          </p>
          <p>
            Their application is web-based, so card-present will write to a message queue where a control program will receive the request and talk over TCP to the EMV reader to perform the payment. The web-browser will wait until a response is received and then continue depending on what response was given. Server to browser communication while in this holding pattern is handled via signalr.
          </p>
          <p>
            Tech: .NET, TSYS EMV
          </p>
        </article>

        <article>
          <p className="projectTitle">Customer Portal with oAuth</p>
          <p className="projectClient">Nationwide Buying Group</p>
          <p className="projectTimeline">July 2018</p>
          <p>
          Implemented a customer portal for an internal data-entry application. Customers do not have accounts within the internal application, so we utilize oAuth to authorize/validate their identity against a service developed by another vendor. After receiving our oAuth grant, we hit several REST APIs to gather their information and then display their information.
          </p>          
          <p>
            Tech: .NET MVC, oAuth, REST
          </p>
        </article>
        <article>
          <p className="projectTitle">Quality Control Checkoff</p>
          <p className="projectClient">Overhead Crane Manufacturer</p>
          <p className="projectTimeline">April 2018 – June 2018</p>
          <p>
          Working with a client to digitize paper quality control checkoff sheets. Written in Xamarin for Android, it works completely offline and then syncs the work up to the server upon completion.
          </p>        
          <p>
          The existing QC sheets were all developed in Excel, so I take all collected data from the app and render it on top of their existing Excel form. We even collect signatures on the tablet, serialize them into the database record, and then render them on the excel sheet.
          </p>
          <p>
            Tech: Xamarin, MS-SQL, .NET MVC
          </p>
        </article>
        <article>
          <p className="projectTitle">Digital Menus</p>
          <p className="projectClient">Restaurant Chain</p>
          <p className="projectTimeline">January 2017 – January 2018</p>
          <p>
            Working with a large cafeteria-style restaurant chain to develop digital menu-board capabilities. They have a rather unique use-case in that every single location may be running a different menu on a different day, 
            and they each gets custom written by management at each location.
          </p>
          <p>
            The first priority was to re-imagine the paper-based menu writing. We worked internally with all parts of the company to develop a back-office menu writing solution to digitize the entire process. As part of this solution we have been able to speed up the menu writing process by allowing the end-user to create templates for reuse.
          </p>
          <p>
            Once the menus were being consistently written using our new internal tool, we developed a custom menu board solution using Raspberry Pi devices, a REST API, and JavaScript. If an item is swapped out on the food-line during service, the menu board can immediately reflect the change to the overhead board.
            </p>
          <p>
            Tech: .NET MVC, AWS RDS, Raspbian running in kiosk mode
          </p>
        </article>
        <article>
          <p className="projectTitle">Accounting Automation</p>
          <p className="projectClient">NC General Contractor</p>
          <p className="projectTimeline">October 2017</p>
          <p>
            Working with the Accounting department of a large NC-based contractor to automate manual accounting processes.
          </p>        
          <p>
            The old process involved manually inserting data from Verizon and Wells-Fargo bills into their accounting platform.
          </p>        
          <p>
            The new process I developed utilizes several APIs to dump the vendor data to CSV, transform, and import directly into accounting. This has now completely eliminated 10+ hours a week of manual, error-prone keying.
          </p>        
          <p>
            Tech: .NET
          </p>
        </article>
        <article>
          <p className="projectTitle">Field Maintenance</p>
          <p className="projectClient">Industrial Equipment Servicing</p>
          <p className="projectTimeline">March 2017 - October 2017</p>
          <p>
            Developed a web and mobile application for routine maintenance of equipment in the battery industry. Lead-acid batteries require routine watering to keep the cells healthy, and this application helps track when a battery is due for maintenance. The company this product was built on behalf of makes a product to assist with watering batteries. Access to this application is offered as a value-add.
          </p>
          <p>
            One design constraint of the application is that it must function in an offline scenario. Most of the warehouses where the battery inspections take place have no WIFI signal and often spotty cell signal. In this case, implementation was achieved using SQLite, an internal queue of operations to be replayed, and a REST API. A Bluetooth scanner can optionally be paired with the tablet to provide quick equipment discovery using barcodes.
          </p>
          <p>
            This application was developed as "multi-landlord" application. A "distributor" can have multiple "customers" and each customer can have multiple users. Extensive unit tests helped validate the design and implementation.
          </p> 
          <p>
            Tech: .NET MVC, Xamarin, Azure App Service with custom auth, Azure SQL
          </p>
        </article>

        <article>
          <p className="projectTitle">Online Workorders</p>
          <p className="projectClient">Water Utility</p>
          <p className="projectTimeline">January 2014 - Ongoing (maintenance and new features)</p>
          <p>
            This project has been under continuous improvement and PTCC has a long relationship with them dating back to 1987. Typically, we have consultants working up there several days a month in a staff-augmentation capacity.
          </p>
          <p>
            We developed an internal workorder system that merges records from both MS-SQL and DB2 into a consolidated portal for staff in the field. Each user receives their specific work for the day on the dashboard accessed via their phone. When completing a workorder, they can enter all relevant fields and the workorder will disappear.
          </p>
          <p>
            From 2014-2016, we incrementally improved this system to integrate data and visualization from ArcGIS server into the mobile workorders responsive web application. We added specific classes of workorders as assets in a feature layer and developed a custom map-driven workorder view for tablets.
          </p>
          <p>
            From 2016 onward, we have been focused on methodically moving functionality out of RPG and DB2 and into MS-SQL and C#. We have developed a series of internal web-based portals for inquiry, account administration, payments, and scanned image looks via ODWEK. As of December 2018, we have eliminated greenscreen interfaces from nearly all CSRs. In 2019 we are planning to target core business logic routines and batch applications.
          </p>
          <p>
            Tech: .NET Webforms, MS-SQL, DB2, ArcGis Rest APIs, Google Maps
          </p>         
        </article>
        <article>
          <p className="projectTitle">Mobile Inspections</p>
          <p className="projectClient">Manufacturing/Industrial Client</p>
          <p className="projectTimeline">October 2014</p>
          <p>
          Manufacturing/Industrial Client: Implemented mobile inspection software for the service department. Software was designed specifically for their particular industry and to meet OSHA requirements. Operates offline-first with data sync to a webapi backend. A web-application portal is used for job management, user-account management, and analytics. Customer-facing portal allows the service department to share reports with their customers.
          </p>        
          <p>
            Tech: Xamarin, .NET MVC
          </p>
        </article>
        <article>
          <p className="projectTitle">Veeder Root Polling</p>
          <p className="projectClient">NC Oil and Gas Company</p>
          <p className="projectTimeline">January 2011</p>
          <p>
            Developed a multi-threaded windows service that polls Veeder Root gas pumps over telnet connections for current fuel-levels. These levels were then inserted into a database and analyzed for consumption trends to assist with scheduling fuel deliveries and coordinating dispatch. Front-end web application provided real-time updates and javascript graph visualizations.
          </p>        
          <p>
            Tech: .NET, .NET Remoting, MS-SQL, Veeder-Root
          </p>
        </article>        
        <article>
          <p className="projectTitle">Responsive Web App</p>
          <p className="projectClient">Water Utility</p>
          <p className="projectTimeline">July 2010</p>
          <p>
          Converting legacy ASP to .NET responsive web application. Application is used by utility service technicians in the field to query account information and perform workorders.
          </p>        
          <p>
            Tech: ASP, .NET WebForms
          </p>
        </article>
      </Layout>
      <style jsx>{`
        article {
          margin-top: 20px;
          width: 100%;
          max-width: 1200px;
          border-bottom: 1px dashed black;
        }

        h1{
          margin-bottom:5px;          
        }

        .projectTitle{
          font-weight: bold;
          margin: 0;
          padding: 0;          
        }
        .projectClient{
          font-weight: bold;
          margin: 0;
          padding: 0;          
        }
        .projectTimeline{
          font-weight: bold;
          margin: 0;
          padding: 0;        
          
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