---
title: 'Extended scancodes in sendinput'
author: 'Michael Davis'
date: '2020-07-11'
published: true
---

A while ago I wrote a virtual KVM program that would allow you to drive the keyboard and mouse of other computers (even cross-platform), using a single host machine. Communication was done over the network. I kept track a the "virtual" position of the mouse, and if you veered into the screen position of another computer I would eat all keystrokes / mouse movement via a hook and replay it on the other machine.
<https://github.com/michaelwda/OutsideTheBox/blob/master/OTB.Core/Hook/Platform/Windows/WindowsGlobalHook.cs>

Pretty fun code to write, for a toy project. I ran into some interesting things regarding keyboard input. Really the best method here is to go as low-level as possible. On Windows I decided to use SendInput, but it would probably be even better to write a virtual keyboard/mouse driver.

When using SendInput, you can specify that it's a keyboard input and send the scancodes directly. This gives you lots of power to replay keystrokes exactly, but it was a little tricky when trying to replay extended scancodes.

From some old comments of mine:

```C#
/*
* The extended-key flag indicates whether the keystroke message originated from one of the additional keys on the enhanced keyboard.
* The extended keys consist of the ALT and CTRL keys on the right-hand side of the keyboard; the INS, DEL, HOME, END, PAGE UP, PAGE DOWN, and arrow keys in the clusters
* to the left of the numeric keypad; the NUM LOCK key; the BREAK (CTRL+PAUSE) key; the PRINT SCRN key; and the divide (/) and ENTER keys in the numeric keypad. The extended-key flag is set if the key is an extended key.
*/
```

If you're trying to replay an extended scancode via sendinput, you have to pass an array of scancodes with the first one being 0Xe0.

```C#
 public override void SendKeyDown(Key key)
        {
            int tscancode;
            VirtualKeys tvk;
            int tflags;
            var keyup = false;
            var altDown = KeyboardState.IsKeyDown(Key.AltLeft) || KeyboardState.IsKeyDown(Key.AltRight);
            bool extended;
            WinKeyMap.ReverseTranslateKey(key, keyup, altDown, out tscancode, out tvk, out tflags, out extended);

            bool sysKey = (!altDown && key == Key.AltLeft) || (!altDown && key == Key.AltRight) || ((key != Key.AltLeft && key != Key.AltRight && altDown));

            var dwFlags = 0x0008;
            if (extended)
                dwFlags = dwFlags | 0x0001;

            var altdown = ((tflags) & ((int)KeyFlags.KF_ALTDOWN >> 8)) > 0;
            var dlgmode = ((tflags) & ((int)KeyFlags.KF_DLGMODE >> 8)) > 0;
            var menumode = ((tflags) & ((int)KeyFlags.KF_MENUMODE >> 8)) > 0;
            var repeat = ((tflags) & ((int)KeyFlags.KF_REPEAT >> 8)) > 0;
            var up = ((tflags) & ((int)KeyFlags.KF_UP >> 8)) > 0;

            KeyboardState.SetKeyState(key, true);

            NativeMethods.INPUT[] inputs;
            if (extended)
            {
                inputs = new[]
                {
                    new NativeMethods.INPUT
                    {
                        type = NativeMethods.INPUT_KEYBOARD,

                        u = new NativeMethods.InputUnion
                        {
                            ki = new NativeMethods.KEYBDINPUT()
                            {
                                wScan = (ushort) 0xe0,
                                wVk = (ushort) 0,
                                dwFlags = (ushort) 0,
                                dwExtraInfo = NativeMethods.GetMessageExtraInfo()
                            }
                        }
                    },
                    new NativeMethods.INPUT
                    {
                        type = NativeMethods.INPUT_KEYBOARD,

                        u = new NativeMethods.InputUnion
                        {
                            ki = new NativeMethods.KEYBDINPUT()
                            {
                                wScan = (ushort) tscancode,
                                wVk = (ushort) tvk,
                                dwFlags = (ushort) dwFlags,
                                dwExtraInfo = NativeMethods.GetMessageExtraInfo()
                            }
                        }
                    }
                };
            }
            else
            {
                inputs = new[]
                {
                    new NativeMethods.INPUT
                    {
                        type = NativeMethods.INPUT_KEYBOARD,

                        u = new NativeMethods.InputUnion
                        {
                            ki = new NativeMethods.KEYBDINPUT()
                            {
                                wScan = (ushort) tscancode,
                                wVk = (ushort) tvk,
                                dwFlags = (ushort) dwFlags,
                                dwExtraInfo = NativeMethods.GetMessageExtraInfo()
                            }
                        }
                    }
                };
            }

            NativeMethods.SendInput((uint)inputs.Length, inputs, Marshal.SizeOf(typeof(NativeMethods.INPUT)));
        }
```

I legit, couldn't find this document ANYWHERE except in a footnote of an image in some old documentation. Maybe it's in some manuals somewhere, but I had the hardest time figuring it out.

At some point I'm going to reboot and completely rewrite this project, especially now that C# has traits :)
