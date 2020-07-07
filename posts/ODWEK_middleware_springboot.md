---
title: 'ODWEK Middleware with Spring Boot'
author: 'Michael Davis'
date: '2018-06-07'
published: true
# hero_image: ../static/.jpg
---
Recently a client was upgrading to CMOD V10.1 on the iSeries and we noticed that the CGI/Servlet support has been removed, after being deprecated in V9.0

*"OnDemand Web Enablement Kit (ODWEK) CGI/Servlet support no longer shipped: Support for CGI/Servlet was deprecated at V9.0 and has been removed from the product at V10.1."*

At this particular client, that I've wrote about before, we are doing some interesting things with pulling documents and text out of CMOD programatically. We have custom reports, email attachment functions, on the fly TIF conversion, etc. All of this is written in C# wrapped around the legacy CGI component.

Upgrading to V10.1 means we needed to re-implement the CGI functionality using the Java API. My first inclination was to use IKVM to convert the API to a C# dll and call it directly. I ended up hitting a brick wall with this related to some strange type marshalling and decided to implement the way IBM likely intended: with a java servlet.

I decided that if I was going to basically re-implement the CGI functionality, I would make it work the way I needed. Previously I was calling the CGI page and scrapping the HTML. Forget that now that I'm going to be in control, I'm going to return JSON!

# Install ODWEK
Our CMOD is running under the iSeries, but I decided to code the servlet for a tomcat instance running on windows. A coworker gave me a copy of ODWEK V9 for Windows. He didn't have a copy V10.1 yet, and I needed to get this done, so I went with it. I doubt the API surface will change too much between versions. He has also recently informed me that he upgraded to V10.1 on the iSeries, and my servlet environment running under Windows has continued functioning, so it doesn't appear like there's much of an issue interoperating.

Install the ODWEK for windows. Go on, I'll wait.

![install](/static/odwek/Install.png)

# Make ODWEK Work!

Don't get fancy yet. Write a plain old java program and make it work. Before you even start introducing the compexity of Tomcat, Spring, etc, let's just make a basic program work. This is absolutely neccesary because there's actually a fair amount of things you need to make work.

![three files](/static/odwek/3files.png)

I wrote a series of classes that will will query a folder. Compile each of these with javac. Notice how I reference my install path to the ODAPI jar file. You will need the java SDK installed for this.

I've uploaded each of these files to github for reference.

<https://github.com/michaelwda/ODWEKServlet/tree/master/PlainJava>


```bash
javac -cp "C:\Program Files\ibm\OnDemand Web Enablement Kit\V9.0\api\ODAPI.jar";. ODQueryResult.java

javac -cp "C:\Program Files\ibm\OnDemand Web Enablement Kit\V9.0\api\ODAPI.jar";. ODUtil.java

javac -cp "C:\Program Files\ibm\OnDemand Web Enablement Kit\V9.0\api\ODAPI.jar";. QueryFolder.java
```

The queryfolder is the program we care about. It's called with 3 parameters: FolderName Criteria Value

Now, try to run your program.
```bash
java -cp "C:\Program Files\ibm\OnDemand Web Enablement Kit\V9.0\api\ODAPI.jar";. QueryFolder Customer AccountNumber 123456
```

![Error 1](/static/odwek/Error1.png)

# Error #1
Apparently the ODWEK installer isn't smart enough to add itself to your path. Go ahead and do that.
You will need to restart your command line at this point.

![Error 1 Fix](/static/odwek/Error1Fix.png)

# AND AGAIN!
![Error 2](/static/odwek/Error2.png)

This time it loaded ars3wapi32, but there were MORE dependent assemblies that it couldn't find because they're not on the path. Depending on your architecture, you either need to add

**C:\Program Files\ibm\OnDemand Web Enablement Kit\V9.0\lib32**
or
**C:\Program Files\ibm\OnDemand Web Enablement Kit\V9.0\lib64**

I'm running a 32bit JDK on a 64 bit machine...so I went for lib32. Seemed to work. Now I can start working on my servlet.

![Error 2 Fix](/static/odwek/Error2Fix.png)

![Finally Works](/static/odwek/Works.png)

Success - it returned 0 records 🙂

# Servlet Time!
Fairly recently I've been doing some work with Spring Boot. It was fairly natural for me to use this because I'm familiar with it. I'm sure you could use any of a number of servlet technologies.

I don't want to go too deep into Spring Boot and Maven, so I'm just going to hit the big points here.

1.  I wrote a single Controller called `APIController` that has two routes.
    * /query – this queries a particular folder
    * /document – returns a document as a byte array

    One strange thing was that my document ids included non-printable unicode, so I simply replace these with a pipe before returning my JSON. There’s likely a better solution here, but it’s good enough to work for my purposes.

2. Since I’m using the ODAPI.jar, I need it on my classpath and to be included in my package JAR/WAR file. The best way to do this, is to install it into your maven.

    * Run this from the command line with Maven (<https://stackoverflow.com/a/4955695>)

    ```bash
    mvn install:install-file -Dfile=ODApi.jar -DgroupId=ODApi -DartifactId=ODApi -Dversion=1.0 -Dpackaging=jar -DgeneratePom=true
    ```
    ![Maven](/static/odwek/Maven.png)

3. I modified my Spring Boot app to generate a WAR instead of a fat JAR. There are instructions online for how to do this. It mostly involves changing your @SpringBootApplication class and some settings in POM.xml.


Note: I noticed that the initial negotiation for logging on to the ODServer was taking quite a bit of time. Too long to be performant for my users, so I cached a single connection and then simply synchronized all my methods that use it. If you have a bit of volume, more than a handful of users, it would probably make sense to implement a connection pool. I'll leave that as an exercise for the reader!

Testing this is easy enough. Fire up spring boot and issue a query via web-browser.

![Test](/static/odwek/Testinbrowser.png)

Note: I'm not handling AFP or application/line inside the servlet. This servlet is actually my middle tier, so I'm simply passing it along to my calling service (C#). I have some C# code that is parsing out the application/line format.

P.S. if you do try to parse out the application/line and it's coming from the iseries, don't forget it's in **EBCDIC**!

## Happy Coding!