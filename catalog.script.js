const glob = require('glob')
const { groupBy, mapValues, map, last, replace, template, keys, forEach } = require('lodash')
const fs = require('fs')

const groupPattern = new RegExp('\./_posts/(\\d+)/.*.md$')

const catelogMarkDownTemplate = `
# Isan 博客文章归档

以往博客文章归档

<% forEach(keys(groupDocsYearMapping).sort().reverse(), (year) => { %>
## [<%- year %> 年](./_posts/<%- year %>/)
<% forEach(groupDocsYearMapping[year], (groupDoc) => { %>
- [<%- groupDoc.title %>](<%- groupDoc.path %>)
<% }) %>
<% }) %>
`

glob('./_posts/**/*.md', (err, files) => {

  const groupDocsYearMapping = mapValues(
    groupBy(files, (file) => {
      return groupPattern.exec(file)[1]
    }),
    (group) => {
      return map(group, (file) => {
        return {
          title: replace(last(file.split('/')), '.md', ''),
          path: file,
        }
      })
    })

    fs.writeFileSync(
      './README.md',
      template(catelogMarkDownTemplate)({groupDocsYearMapping, keys, forEach}),
      {
        encoding: 'utf-8'
      }
    )
})
