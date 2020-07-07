---
title: 'Split And Encrypt PDF'
author: 'Michael Davis'
date: '2017-07-09'
published: true
# hero_image: ../static/.jpg
---
# Why
At my company, we recently had a need internally where we wanted to split and subsequently encrypt each page of a PDF. In our exact case, we wanted to split a payroll PDF file into individual paystubs based upon the employee's name. Once we had each page separated, we also wanted to encrypt the employee's paystub using a password that they provided.

[Check it out on github](https://github.com/michaelwda/PayrollSplitter)


# How to do it

​Use a PDF library to open the file in question.
Find a way to extract the text from each page, and look for a key-phrase or unique id.
Separate out that single page, encrypt it, and save it using the aforementioned PDF library.

# PDF library
I originally developed this application using PDFSharp, but a change in PDF format made the application stop working. This ended up being due to PDF iref streams, which are unsupported in the current version of PDFSharp (they *are* supported in the current beta). I switched to a library called [iTextSharp](https://github.com/itext/itextsharp) that got the job done. Please note,  iText is AGPL and this can't be used commercially without purchasing the rights from iText.

# Settings
There's a settings section where you can define our employees, along with a unique identifier. This unique identifier is used to figure out of a paystub actually belongs to them. Depending on the size of your company, you could probably just use the employee's full name.
![ss1](/static/paystub/ss1.png)

# Loading the PDF
On the main screen, you can just point ourselves to the PDF in question. At this point, the program will process the PDF, split the pages, and encrypt the resulting files. The preview button will allow us to take a peek. When you attempt to open the preview PDF, you can see that the file is already password-protected.

![ss2](/static/paystub/ss2.png)

![ss3](/static/paystub/ss3.png)

![ss4](/static/paystub/ss4.png)

# Save all stubs to a folder
Once you have confirmed that everything is looking good, save all of the encrypted files off to a directory.

![ss6](/static/paystub/ss6.png)

![ss7](/static/paystub/ss7.png)

# The Code
The real meat of all of this is inside the payroll splitter service. You can see the entire file on github.

Text-extraction is done using the iTextSharp simple text extraction.

Then simply use PdfCopy, a memory stream, and PdfStamper, to seperate/encrypt the individual pages.

```C#
public List<PayStub> GenerateIndividualStubs(string filename)
{

    List<PayStub> stubs=new List<PayStub>();
    using (var reader = new PdfReader(filename))
    {
        
        for (var page = 1; page <= reader.NumberOfPages; page++)
        {
            //extract page text
            var strategy = new iTextSharp.text.pdf.parser.SimpleTextExtractionStrategy();
            var currentText = iTextSharp.text.pdf.parser.PdfTextExtractor.GetTextFromPage(reader, page, strategy);
            
            var paystub = FindPayStubMatch(currentText);
            if (paystub == null) continue;

            //write this individual page into a temp file
            var outFileName = System.IO.Path.GetTempPath() + Guid.NewGuid() + ".pdf";

            var pdfDoc = new Document(reader.GetPageSizeWithRotation(page));
            var stream = new MemoryStream();
            var pdf = new PdfCopy(pdfDoc, stream);
            pdf.CloseStream = false;
            pdfDoc.Open();
            pdf.AddPage(pdf.GetImportedPage(reader, page));                    
            pdf.Close();
            pdfDoc.Close();
            stream.Position = 0;
            
            var stamper = new PdfStamper(new PdfReader(stream), new FileStream(outFileName,FileMode.Create));
            if ((paystub.Password + "").Length > 0)
            {
                stamper.SetEncryption(Encoding.ASCII.GetBytes(paystub.Password), Encoding.ASCII.GetBytes(paystub.Password), PdfWriter.ALLOW_PRINTING,
                    PdfWriter.ENCRYPTION_AES_128 | PdfWriter.DO_NOT_ENCRYPT_METADATA);
            }
            stamper.Close();
            stream.Close();

            paystub.Filename = outFileName;                
            stubs.Add(paystub);

        }


    }
    return stubs;
}
```

# Next Steps
The logical next step here would be to tie this into an email server. I've implemented something similar to this for several clients wanting to automatically send through their exchange server.

1. We pull the employee list out of their existing accounting solution automatically using Sql. This reduces the burden of maintaining two systems.
2. Instead of saving the PDFs to a folder, we automatically send them out through an email server directly to the employee's email with the PDF as an attachment.