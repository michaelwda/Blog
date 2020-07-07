---
title: 'C# replacement of ODWEK applet'
author: 'Michael Davis'
date: '2017-06-15'
published: true
# hero_image: ../static/.jpg
---
# NOTE: I've recently coded this up the "correct" way using the Java Api. See here: [ODWEK Middleware with Spring Boot](ODWEK_middleware_springboot)

## NPAPI
Google Chrome completely removed NPAPI as of September 2015. http://www.chromium.org/developers/npapi-deprecation

I think most people would agree that this is a *good* thing for security and web-standards. Remember when Apple said NO to Adobe Flash on the iPhone and everybody went crazy? I feel like history has proven that decision the be correct, and this is just an extension of that.

Anyways, google provided plenty of notice that they were going to do this. They even deprecated the feature, but left a way to turn it back on for a short time. A smart developer would have seen this and been hard at work implementing a new solution that doesn't rely on NPAPI. Apparently, I am not smart.

As a consultant, I'm not really in the seat most of the time. I was using an IBM applet that relied on NPAPI it and it worked, so everything was good. I eventually got the call that the ODWEK viewer wouldn't load and they couldn't view receipts. The client had to go back to using the desktop client instead of being able to click the link from the CSR portal I had written. Sure, they could just switch to IE, but I decided to go a different route.

## ODWEK
For the unitiated, ODWEK stands for On-Demand Web Enablement Kit. Basically a web api for viewing data stored in IBM's content manager. Think iSeries. The viewer itself launched as an applet in the browser (NPAPI) and would pull / display the content. For this client, all of their content was TIFF, PDF, HTML, or TXT. Nothing exotic.

I stepped back for a moment on this and thought about it. The applet is code, running locally. It MUST be pulling data across the network and then just displaying it. Why don't I just find out how it's doing that, perform the operation server-side, and then spit the content out to the browser with the correct MIME type.

## Digging in

The exact workflow was:

1. Hit arswww.cgi for a listing of receipts/images
2. Click the link, launching the viewer. Tiffs and PDFs seemed to just spit out to the browser with no viewer. The payment receipts folder was attempting the load the applet unsuccessfully.

So, I need to write a wrapper around arswww.cgi, intercept all the HREF elements, and call into my own code. Cool.
What I really needed to find out, first of all, was if I could even reverse engineer the web calls that the applet makes?

I grabbed a copy of the applet off of the iSeries and decompiled it using jd-gui. I'll skip my journey of trying to grok the decompiled source, but the relevant code was in a file called LDVServerInterface.class.
![Decompiled](/static/odwek/Decompiled.png)

The basics of this are:

1. There will be a series of parameters in the format of "param=n". After the param, there will be N bytes of data.
2. If the parameter is a physical or logical buffer, read it into a byte stream.
3. If the parameter says "DATA", read two more bytes into the bytestream and then deflate it into a string value. This is your data.
```C#
private string GetReceipt(string requestUrl)
{
    string data = "";
    var client = new WebClient();
    var byteStream = client.OpenRead(requestUrl);

    //var table = new Dictionary<string, string>();

    var builder = new List<byte>();
    var b = 0;
    while (byteStream != null && (b != -1 && byteStream.CanRead))
    {
        //read param
        for (b = byteStream.ReadByte(); (b != -1) && (b != 61) && (b != 10); b = byteStream.ReadByte())
        {
            builder.Add((byte)b);
        }

        if (builder.Count != 0 && b == 61 && b != -1)
        {
            var param = Encoding.UTF8.GetString(builder.ToArray());
            var valueBuilder = new List<byte>();
            //read value
            while ((b = byteStream.ReadByte()) != 10)
            {
                if (b == -1)
                    break;
                valueBuilder.Add((byte)b);


            }
            var paramValue = Encoding.UTF8.GetString(valueBuilder.ToArray());

            if (param == "DATA")
            {
                var readLength = int.Parse(paramValue);
                byteStream.ReadByte();
                byteStream.ReadByte();
                using (var deflate = new DeflateStream(byteStream, CompressionMode.Decompress))
                {
                    using (var reader = new StreamReader(deflate, true))
                    {
                        data = reader.ReadToEnd();
                    }
                }

            }
            else if (param == "PHYSICAL_BUFFER" || param == "LOGICAL_BUFFER")
            {
                var n = int.Parse(paramValue);
                var localByte = new byte[n];
                var i1 = byteStream.Read(localByte, 0, n);
                while ((i1 != n) && (i1 != -1))
                {
                    i1 += byteStream.Read(localByte, i1, n - i1);
                }

                byteStream.ReadByte();

            }
            else
            {
                //table.Add(param, paramValue);
            }
        }

        builder = new List<byte>();

    }

    byteStream.Close();
    return data;
}
```
 
## Wrapping it
Next steps here:

1. Write a wrapper around arswww.cgi that parses the HTML, modifies any HREF elements, and points it back internally to my own file intercept code.
2. Feel bad that i'm using arswww.cgi, because it too, is deprecated....

So, my wrapper page. Basically just a plain aspx with a literal tag.
`<asp:Literal ID="ScrapedData" runat="server"></asp:Literal>`

Code-behind intercepts some parameters and sends them along. Then I parse the HTMl using HTMLAgilityPack and replace the Href of all the links.
```C#
var account = "" + Request["AccountNumber"];
var folder = "" + Request["Folder"];

var query = "Account Number";

if (folder == "PaymentReceipts")
    query = "AccountNumber";

if (folder == "")
    folder = "Customer";

string html;
using (var client = new CookieAwareWebClient()) // WebClient class inherits IDisposable
{
    html = client.DownloadString(string.Format("http://10.1.1.1/scripts/arswww.cgi?_f={0}&_a=d&{1}={2}&_server=???&_user=???&_password=???&_function=logon",folder,query, account));
    Session["CookieContainer"] = client.CookieContainer;
}

var doc=new HtmlDocument();
doc.LoadHtml(html);

var tables = doc.DocumentNode.SelectNodes("//table");
if (tables == null) return;

//modify all the links in table
var links = doc.DocumentNode.SelectNodes("//a");
if (links != null)
{
    foreach (var link in links)
    {
        var href = link.Attributes["href"].Value;
        var encodedHref = HttpUtility.UrlEncode(href);
        link.Attributes["href"].Value = "OnDemandFileIntercept.aspx?AccountNumber=" + account + "&url=" +
                                        encodedHref;
    }
}

//output table
foreach (var table in tables)
{
    ScrapedData.Text += table.OuterHtml;
}
```
 
Then my intercept does it's thing.

```C#
protected void Page_Load(object sender, EventArgs e)
{
    var url = "" + Request["url"];
    var cookies = Session["CookieContainer"];
    var account = "" + Request["AccountNumber"];
    if (cookies == null || url == "") return;

    var decode = HttpUtility.UrlDecode(url);
    if (decode.Contains("_f=PaymentReceipts"))
    {
        var requestUrl = "http://10.1.1.1" + HttpUtility.UrlDecode(url) + "&_applet=1&_line=native&_s=???&_u=???&_p=???";
        var receiptData = GetReceipt(requestUrl);

        receiptData = receiptData.Replace("\n", "<br>");
        Response.Write(receiptData);
        Response.ContentType = "text/html";


    }
    else
    {
        using (var client = new CookieAwareWebClient()) // WebClient class inherits IDisposable
        {
            client.CookieContainer = cookies as CookieContainer;
            var data = client.DownloadData("http://10.1.1.1" + url);

            Response.ClearContent();
            Response.Clear();
            Response.ClearHeaders();

            var mime = GetMimeFromBytes(data);

            Response.ContentType = mime;

            if(mime.Contains("application"))
                Response.AppendHeader("content-disposition", "filename=" + account + ".afp");
            else
                Response.AppendHeader("content-disposition", "filename=" + account + ".tiff");

            Response.OutputStream.Write(data, 0, data.Length);
        }
    }

    
}
```
 
Nice!
So, at this point I just deployed the code and changed the link on the customer CSR to point to my ODWEK interceptor. Problem solved...for now 🙂