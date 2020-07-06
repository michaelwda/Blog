---
title: 'How to batch change the date received on Office 365 mail'
author: 'Michael Davis'
date: '2017-07-12'
# hero_image: ../static/.jpg
---
Sometimes bad things happen to good mailboxes. We were recently doing a fairly standard mailbox migration from Google Apps to Office 365. This mailbox in particular was about 30 GB and had mail going back 20+ years. It also had some previous migration history.

# The History
Nothing too unusual here. In 2014 the mailbox was migrated off of Exchange server and onto Google Apps. Now, in 2017, it was being migrated from Google Apps to Office 365.

Everything went perfectly, but there was one problem. A large portion of the mail was showing an incorrect date received. During the initial migration, Google Apps had set the Received Date to be the date of the migration on a large portion of messages.

# Fixing it
We added the account in question to one of our developers' laptops. Take care to sync ALL of the mail.

![Change Account](/static/redemption/redemption1.png)

Once all the mail is pulled down from the server, you can inspect the messages using a tool called MFC MAPI

Here's a look at an example message.

![Message](/static/redemption/redemption2.png)

This is interesting - but it's just not feasible to fix 20 years of mail by editing each message. Enter Redemption.

# Redemption
[Redemption](http://www.dimastr.com/redemption/home.htm) is a COM library that uses extended mapi to duplicate the functionality of the Outlook Object Model. Basically, we can manipulate outlook using a program. Now we're in business.

Sometimes, you just need to write a quick and dirty program, run it once, and throw it away. That's exactly what we did.

In this particular case, we noticed that the Sent Date on the effected mail was still accurate. So, we just iterated across every single message from before 06/2014, and set the Received Date to match the Sent Date.

[Full Project on Github](https://github.com/michaelwda/MAPIReader)

```C#
class Program
{
    static void Main(string[] args)
    {
        //tell the app where the 32 and 64 bit dlls are located
        //by default, they are assumed to be in the same folder as the current assembly and be named
        //Redemption.dll and Redemption64.dll.
        //In that case, you do not need to set the two properties below
        RedemptionLoader.DllLocation64Bit = @"Redemption/redemption64.dll";
        RedemptionLoader.DllLocation32Bit = @"Redemption/redemption.dll";
        //Create a Redemption object and use it
        RDOSession session = RedemptionLoader.new_RDOSession();

        session.Logon(Missing.Value, Missing.Value, Missing.Value, Missing.Value, Missing.Value, Missing.Value);
        
        var stores = session.Stores;
        foreach (RDOStore rdoStore in stores)
        {
            if (rdoStore.Name.Contains("michael"))
            {
                var folderId = rdoStore.RootFolder.EntryID;
                PerformMailFix(folderId, session);
            }

        }
        Console.WriteLine(count);
        Console.ReadKey();
        session.Logoff();
        
    }

    private static int count = 0;
    private static void PerformMailFix(string folderId, RDOSession session)
    {
        var folder = session.GetFolderFromID(folderId);

        if (folder.FolderKind == rdoFolderKind.fkSearch)
            return;

        var before=new DateTime(2014,06,30);
        foreach (RDOMail item in folder.Items)
        {
            if (item.ReceivedTime >= before) continue;
            var diff = item.ReceivedTime - item.SentOn;
            if (!(diff.TotalHours > 10)) continue;
            Console.WriteLine("" + item.Subject + " - " + item.ReceivedTime + "    " + item.SentOn);
            count++;
            item.ReceivedTime = item.SentOn;
            item.Save();
        }

        Console.WriteLine(folder.DefaultMessageClass);
        //do the same fix for all subfolders
        foreach (RDOFolder subFolder in folder.Folders)
        {
            PerformMailFix(subFolder.EntryID, session);
        }
        
    }
}
```

# Syncing Up
Once we developed and ran the program, we launched Outlook on our development laptop and let it sync up to the Office 365 cloud. Once the sync was completed, all other connected devices pulled down the changes automatically and showed the correct date!