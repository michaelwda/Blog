---
title: 'EF Core Soft-Delete'
author: 'Michael Davis'
date: '2019-12-04'
published: true
# hero_image: ../static/.jpg
---

This post is a combination of two posts. I have removed the original, because my implementation of soft-delete had a bug that only occured once you started implementing more complex joins. I'd rather not be spreading broken code around.

This version works.
https://stackoverflow.com/questions/45096799/filter-all-queries-trying-to-achieve-soft-delete/45097532#45097532

I believe this was only so complicated because I wanted to be stubborn and apply the filter automatically by iterating across my modelBuilder. 

```C#
public static class EFFilterExtensions
{
    public static void SetSoftDeleteFilter(this ModelBuilder modelBuilder, Type entityType)
    {
        //this is using reflection to set the generic arguments for the SetSoftDeleteFilter
        //below. This let's us iterate across the entities in db-context and then call
        //by passing in the clrType
        SetSoftDeleteFilterMethod.MakeGenericMethod(entityType)
            .Invoke(null, new object[] { modelBuilder });
    }

    static readonly MethodInfo SetSoftDeleteFilterMethod = typeof(EFFilterExtensions)
        .GetMethods(BindingFlags.Public | BindingFlags.Static)
        .Single(t => t.IsGenericMethod && t.Name == "SetSoftDeleteFilter");

    public static void SetSoftDeleteFilter<TEntity>(this ModelBuilder modelBuilder)
        where TEntity : BaseModel
    {
        modelBuilder.Entity<TEntity>().HasQueryFilter(x => !x.Deleted);
    }
}
  
  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
      base.OnModelCreating(modelBuilder);
      foreach (var entityType in modelBuilder.Model.GetEntityTypes())
      {
          if (entityType.ClrType.IsSubclassOf(typeof(BaseModel)))
              modelBuilder.SetSoftDeleteFilter(entityType.ClrType);
      }
  }
  
  public abstract class BaseModel
  {
      public int Id { get; set; }

      public bool Deleted { get; set; }

      public DateTime DateCreated { get; set; } = DateTime.Now;

      public DateTime DateModified { get; set; } = DateTime.Now;
  }
  ```