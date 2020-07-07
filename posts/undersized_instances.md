---
title: 'Undersized Instances'
author: 'Michael Davis'
date: '2019-01-09'
published: true
# hero_image: ../static/.jpg
---

I launched a rather large project on AWS using very small instances for the application servers and database (RDS). The application itself is seasonal, so the traffic spikes in December and then levels out. In December we had 250k unique page views.

It was kind of interesting using under-sized instances and seeing how things go wrong. On the application side of things it sailed along. MySQL is where all the problems seemed to be concentrated.

I spent a bit of time early in my career writing A LOT of SQL and within the past few years I've spent a bit of time leveling up my skills in regards to MS-Sql internals. Things like indices, waits, latches, how to use extended events, etc. So anyways, I just happened to have a specific set of skills to put out the MySql dumpster fire before it crashed the whole application. 

If anyone is interested, below is what deadlocks look like.

![](/static/undersized/deadlocks.jpg)

It makes me wonder what would have happened if I had over-sized these instances and been ignorant of sql internals. Would the application have just continued working? Maybe it would have kept trudging along, doing more heavy lifting than it should, while being just a little bit laggy. Maybe I would have thrown more resources at it. 

I can certainly empathize with someone who just wants to put their data somewhere and pull it back without having to worry about how a deadlock condition is going to exhaust their connection pool. I'm sure it's things like this that gave rise to BaaS platforms like firebase.