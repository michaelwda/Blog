---
title: 'Proper Date Formatting with Thymeleaf and Spring'
author: 'Michael Davis'
date: '2018-06-05'
published: true
# hero_image: ../static/.jpg
---

In Spring, if you attempt to display a Date from your viewmodel in an HTML5 date input, it won't format correctly.

To fix - you can implement custom binder on your controller. Put the following at the top of your controller.
```java
@InitBinder
public void initBinder ( WebDataBinder binder )
{    	 
    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
    dateFormat.setLenient(false);
    binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));
}
```