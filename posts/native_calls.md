---
title: 'Native OSX calls using .NET Core and pinvoke'
author: 'Michael Davis'
date: '2018-02-28'
# hero_image: ../static/.jpg
---

As an experiment I wanted to write some code in .NET Core that would call native OSX call to perform an action not exposed by .NET Core. I decided to make a program that would simply move the mouse a little bit.

This ended up being really simple once I figured out a few gotchas. 

- The DllImports need to reference the CoreGraphics framework, not a dylib file.
- OSX wants 64 bit types!

```C#
using System;
using System.Drawing;
using System.Runtime.InteropServices;
using System.Threading;


namespace consoletest
{
    class Program
    {
        static void Main(string[] args)
        {
            uint myDisplay = CGMainDisplayID();
            Console.WriteLine(myDisplay);
            for (double i = 0; i < 1000;i+=10)
            {
                var err=CGDisplayMoveCursorToPoint(myDisplay,new CGPoint() { X = i, Y = i });
                Thread.Sleep(10);
            }

        }


        [DllImport("/System/Library/Frameworks/CoreGraphics.framework/CoreGraphics")]
        public static extern int CGDisplayMoveCursorToPoint(uint display, CGPoint point);

        [DllImport("/System/Library/Frameworks/CoreGraphics.framework/CoreGraphics")]
        public static extern uint CGMainDisplayID();

        [DllImport("/System/Library/Frameworks/CoreGraphics.framework/CoreGraphics")]
        public static extern int CGWarpMouseCursorPosition(CGPoint point);

    }

    //osx using 64bit types, so we can't pass the .NET PointF type because it's using 32bit Single for x,y
    public struct CGPoint{
        public double X { get; set; }
        public double Y { get; set; }
    }
}
```

I tried using PointF at first and it eventually dawned on me that it was using 32bit Singles and I needed Doubles. After marshaling it kept putting my cursor at 0,0 🙂 

I think it would be pretty fun to write a Mouse Without Borders clone using .NET Core 2.1 and maybe SignalR? 