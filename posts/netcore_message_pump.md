---
title: '.NET Core Message Pump'
author: 'Michael Davis'
date: '2016-04-27'
# hero_image: ../static/.jpg
---

I'm writing a cross-platform mouse without borders clone right now. Basically a .NET version of Synergy. 

Tech stack: .NET Core, SignalR

I ran into an issue with my windows hooks not working when running inside a .NET Core console. This is because if you don't include `Application.Run(new ApplicationContext())`, there is no Windows message pump. Without a message pump, your hooks won't receive anything.

Fortunately, you can implement your own message pump very easily.

At the bottom of your console app, you need to implement a message pump by calling into the native windows API function: GetMessage, TranslateMessage, and DispatchMessage.

```C#
public struct WinMsg
{
    public IntPtr hwnd;
    public uint message;
    public IntPtr wParam;
    public IntPtr lParam;
    public uint time;
    public WinPoint pt;
}

public static class WinNative
{
    [DllImport("user32.dll")]
    public static extern int GetMessage(out WinMsg lpMsg, IntPtr hWnd, uint wMsgFilterMin,uint wMsgFilterMax);

    [DllImport("user32.dll")]
    public static extern bool TranslateMessage([In] ref WinMsg lpMsg);

    [DllImport("user32.dll")]
    public static extern IntPtr DispatchMessage([In] ref WinMsg lpmsg);
}
```

And then in at the bottom of you console app - write the pump

```C#
WinMsg msg;            
while (WinNative.GetMessage(out msg, IntPtr.Zero, 0, 0) > 0)
{
    WinNative.TranslateMessage(ref msg);
    WinNative.DispatchMessage(ref msg);
}
```