# DOMSON

A library that structures data into a JSON object from the DOM and querying text based elements to form its structure.

This library helps to structure JSON data into something that you'd like to extract from HTML, in order to enrich your data by using CSS selectors to query elements to extract its text. This is particulary helpful with scraping. You can see examples down below.

-------

## How to use

The `extract` function consists of two arguments; first being the contents of the HTML, and the second being your schema of how your structured data will look. You can use TypeScript to validate the typings of your schema.

In your property value, if you set it as a string based selector, it will return the first matching element and its text contents by default - trimming the spaces for cleanness.

```ts
import { extract, type Schema, type Element } from 'domson'

// Your typed schema
type Data = {
  title: string
  description: string
  article: {
    body: string
    links: Array<{
      text: string
      href: string
    }>
  }
}

const schema: Schema<Data> = {
  title: 'title',
  description: ['meta[name="description"]', (el: Element) => el.attr('content') ?? ''],
  article: {
    title: 'h1',
    body: 'article .contents',
    links: ['article .foot-links a[href]', (el: Element) => ({
      text: el.text(),
      href: el.attr('href') as string
    })]
  }
} 

const data = extract(contents, schema)
```

Then having this example output:

```json
{
  "title": "Government appoints new Health Secretary",
  "description": "Breaking: government appoints John Appleseed as the new Health Secretary",
  "article": {
    "title": "Health Secretary resigns and is replaced by John Appleseed",
    "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec consectetur quis lacus a vestibulum. Nam aliquet eros enim, vel ornare ligula pharetra sit amet. Nullam metus nisi, sagittis eu maximus eget, vestibulum in neque. Vivamus in dui risus. Vestibulum lacus neque, pretium vitae tincidunt non, molestie vel enim. Phasellus vitae nisl elit. Aliquam posuere pharetra justo id feugiat. Donec elementum consequat libero, id commodo ante. Phasellus eget tellus turpis. Cras consequat urna vel mi bibendum tempus. Vivamus commodo, nunc et porta sollicitudin, leo nibh tristique nunc, at pellentesque risus tellus quis arcu. Integer hendrerit, leo fringilla faucibus hendrerit, turpis lacus viverra lacus, ac lobortis est diam auctor ipsum. Pellentesque in aliquet est.",
    "links": [{
      "text": "Source #1",
      "href": "https://example.com"
    }, {
      "text": "Source #2",
      "href": "https://example.com"
    }]
  }
}
```
