module.exports = function ({ types: t }) {
  return {
    visitor: {
      ImportDeclaration(path, { opts: { libraryName } }) {
        if (!libraryName) return
        if (path.node.source.value === libraryName) {
          const { specifiers } = path.node
          const findResult = specifiers.find(ele => ele.type === 'ImportDefaultSpecifier')
          if (findResult) return
          const genImportDeclaration = (specifiers) => {
            return specifiers.map(specifier => {
              return t.importDeclaration([
                t.importDefaultSpecifier(
                  specifier.local
                )
              ], t.stringLiteral(`${libraryName}/${specifier.imported.name.replace(/^./, s => s.toLowerCase())}`))
            })
          }
          path.replaceWithMultiple(genImportDeclaration(specifiers))
          return
        }
      }
    }
  }
}