---
title: 'CLR Generics and Struct Boxing'
author: 'Michael Davis'
date: '2018-06-19'
# hero_image: ../static/.jpg
---

The PR comments from @benaadams here are awesome. https://github.com/dotnet/corefxlab/pull/2358
This is likely basic knowledge needed for high-performance .NET, but it was new to me. Very interesting to see how defining a generic `<T>` can eliminate boxing/allocations.

The T parameter is explicitly being specified as an interface: `IBufferWriter<byte>;` so if you create that `BufferWriter<IBufferWriter<byte>>` and give it a struct as the T, then its boxed to the interface and stored in the `BufferWriter<IBufferWriter<byte>>` as the boxed `IBufferWriter<byte>` type.
So, if you explicitly specify the T, it will get boxed. If you specify it as a generic, and then call the generic constructor, it will not.

```C#
public static JsonWriter<TBufferWriter> Create<TBufferWriter>(TBufferWriter bufferWriter, bool isUtf8, bool prettyPrint = false) where TBufferWriter : IBufferWriter<byte>
{
     return new JsonWriter<TBufferWriter>(bufferWriter, isUtf8, prettyPrint);
}
```