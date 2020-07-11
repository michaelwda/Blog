---
title: 'How to run tika-server as a windows service using Apache Commons Daemon'
author: 'Michael Davis'
date: '2020-07-10'
published: true
---
 
I have submitted a PR to the Apache Tika project for this, we'll see if they merge it. <https://github.com/apache/tika/pull/324>

Using Apache Commons Daemon <https://commons.apache.org/proper/commons-daemon/> you can host tika-server as a windows service. However, tika-server has no static method for stopping the server, so once started it's impossible to stop the windows service. Not really ideal.

To fix this, you need build from source and add a stop method to TikaServerCli.java and to TikaServerWatchDog.java 

# TikaServerCli.java 
```java
static TikaServerWatchDog watchDog = null;

private static Options getStopOptions()
{
    Options options = new Options();
    options.addOption("preventSystemExit", false, "Prevent the stop method from calling system.exit, which will terminate the JVM. This is useful for integration tests.");
    return options;
}

private static void execute(String[] args) throws Exception {
        Options options = getOptions();

        CommandLineParser cliParser = new GnuParser();
        //need to strip out -J (child jvm opts) from this parse
        //they'll be processed correctly in args in the watch dog
        //and they won't be needed in legacy.
        CommandLine line = cliParser.parse(options, stripChildArgs(args));
        if (line.hasOption("spawnChild")) {
            /*TikaServerWatchDog watchDog = new TikaServerWatchDog();*/
            watchDog = new TikaServerWatchDog();
            watchDog.execute(args, configureServerTimeouts(line));
        } else {
            if (! line.hasOption("child")) {
                //make sure the user didn't misunderstand the options
                for (String childOnly : ONLY_IN_SPAWN_CHILD_MODE) {
                    if (line.hasOption(childOnly)) {
                        System.err.println("The option '" + childOnly +
                                "' can only be used with '-spawnChild'");
                        usage(options);
                    }
                }
            }
            executeLegacy(line, options);
        }
    }

public static void stop(String [] args) {
    // process service stop function
    if(watchDog != null)
    {
        watchDog.close();
    }
    try{
        Options options = getStopOptions();
        CommandLineParser cliParser = new GnuParser();
        CommandLine line = cliParser.parse(options, args);
        if (line.hasOption("preventSystemExit")) {
            return;
        }
    }       
    catch (org.apache.commons.cli.ParseException e){
        e.printStackTrace();
        LOG.error("Can't parse stop arguments: ", e);
        System.exit(-1);
    }  
    System.exit(0);
}
```

# TikaServerWatchDog.java 
```java
public void close()
{
    setChildStatus(CHILD_STATUS.SHUTTING_DOWN);
    LOG.debug("about to shutdown");
    if (childProcess != null) {
        LOG.info("about to shutdown process");
        childProcess.close();
    }
}
```

Once that's built, take your new jar file, and you'll be able to set it up with Apache Commons Daemon. 

- Download the windows specific binary <https://downloads.apache.org/commons/daemon/binaries/windows/>
- Extract. Rename "prunmgr.exe" to "tika-daemon.exe"
![install](/static/tika/1.png)

- I will usually place my jar file in the same directory
# Install as a windows service 
```
C:\source\tika\commons-daemon-1.2.2-bin-windows\amd64\prunsrv.exe //IS//tika-daemon ^
--DisplayName "Tika Daemon"  ^
--Description "Tika Daemon Windows Service" ^
--Classpath C:\source\tika\tika-server.jar ^
--StartClass "org.apache.tika.server.TikaServerCli" ^
--StopClass "org.apache.tika.server.TikaServerCli" ^
--StartMethod main ^
--StopMethod stop ^
--StartMode jvm  ^
--StopMode jvm ^
--StdOutput auto ^
--StdError auto ^
--Jvm "C:\Program Files\Java\jdk1.8.0_211\jre\bin\server\jvm.dll" ^
++StartParams -spawnChild 

```
Once installed, you can double click the renamed "tika-daemon.exe" and view the configuration. If the service fails to start, configure the logging options to inspect the output.
In my case I had trouble with both the JVM AND the archicture. Above you'll see I'm using the 64bit prunsrv.exe and I've manually set the JVM dll path.

`C:\source\tika\commons-daemon-1.2.2-bin-windows\amd64\prunsrv.exe`

`--Jvm "C:\Program Files\Java\jdk1.8.0_211\jre\bin\server\jvm.dll" ^`

![install](/static/tika/2.png)

Once done, tika will be up and running on the default port. Additional configuration can be provided inside the `++StartParams` options

![install](/static/tika/3.png)

AND... it works

![works](/static/tika/4.png)