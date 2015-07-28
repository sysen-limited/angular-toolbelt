## Angular Toolbelt
[![Build Status](https://travis-ci.org/sysen-limited/angular-toolbelt.svg?branch=master)](https://travis-ci.org/sysen-limited/angular-toolbelt)

### Documentation

To use this project checkout the [online documentation](http://toolbelt.sysen.co.uk).

### Quick Overview

To use this project there are **no dependencies** on anything other than Angular, however to get the most out of the UI elements we have chosen bootstrap for any templates which can be overridden.

This toolbelt has been created as they offer useful add-ons to the angular environment which can solve common interactions or UI needs

The following helpers are available for building rich applications with angular;

#### Services

- Platform (Allow detection and information about the client, for example recommend new browsers to those using old ones)

#### Filters

- Pretty Date (Show how many seconds, minutes, hours, days ago a date is)
- Boundary (Find the min or max value within a list or list of objects)
- Convert To Bytes (Convert bytes values to KB, MB, etc...)

#### Directives

- Active Navigation (highlight navigation items depending on current uri location)
- Growl (show dynamically messages on your interface)
- Infinite Scroll (dynamically load data into a list showing on the page once the list reaches the bottom of the page)
- Scroll (automatic scrolling on a page to take users to a set anchor location, but via a jump or animation)
- Markdown (Wrapper for marked project to allow parsing of Markdown text)
- Password Strength (allows checking of passwords against rules to avoid poor password selection)
- Drag and Drop (drag and drop files into your form for attachments, also able to automatically upload on drop)

**Note it is possible to use directives and filters individually however some like the drag and drop directive depend on other parts of this project**
