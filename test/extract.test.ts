import * as Cheerio from "cheerio"
import { extract, Schema } from "../src"
import * as traverseUtils from "../src/traverse"

vi.mock("cheerio", async importOriginal => ({
  ...(await importOriginal()),
}))

const loadSpy = vi.spyOn(Cheerio, "load")
const traverseSpy = vi.spyOn(traverseUtils, "traverse")

type Data = {
  title: string
  description: string
  links: Array<{
    name: string
    url: string | null
  }>
}

const exampleSchema: Schema<Data> = {
  title: 'h1',
  description: 'h1 + p',
  links: [
    'section a',
    () => {
      return ({
        name: eee => eee.text(),
        url: eee => eee.attr('href') ?? null
      })
    }
  ]
}

const exampleContents = `
  <body>
    <div class="example">
      <h1>Heading with <span>example</span></h1>
      <p>Some text content</p>
      <main>
        <section>
          <a href="/link1"><span>Link one</span></a>
        </section>
        <section>
          <a href="/link2"><span>Link two</span></a>
        </section>
        <section>
          <a href="/link3"><span>Link three</span></a>
        </section>
        <section>
          Bottom of page
        </section>
      </main>
    </div>
  </body>
`

describe("Extract functionality", () => {
  it("should load the contents into Cheerio and traverse the schema", () => {
    const data = extract(exampleContents, exampleSchema)

    expect(loadSpy).toHaveBeenCalledOnce()
    expect(loadSpy).toHaveBeenCalledWith(exampleContents)

    expect(traverseSpy).toHaveBeenCalledOnce()
    expect(traverseSpy).toHaveBeenCalledWith(
      expect.any(Object),
      exampleSchema
    )

    expect(data).toEqual({
      title: "Heading with example",
      description: "Some text content",
      links: [{
        name: "Link one",
        url: "/link1"
      }, {
        name: "Link two",
        url: "/link2"
      }, {
        name: "Link three",
        url: "/link3"
      }]
    })
  })
})