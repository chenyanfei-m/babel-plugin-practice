module.exports = function ({ types: t }) {
  const genImportDeclaration = (specifier, libraryName) => {
    return t.importDeclaration(
      [t.importDefaultSpecifier(specifier.local)],
      t.stringLiteral(`${libraryName}/${specifier.imported.name.replace(/^./, s => s.toLowerCase())}`)
    )
  }

  return {
    visitor: {
      ImportDeclaration(path, { opts: { libraryName } }) {
        if (!libraryName) return
        if (path.node.source.value !== libraryName) return
        const { specifiers } = path.node
        const findResult = specifiers.find(ele => ele.type === 'ImportDefaultSpecifier')
        if (findResult) return
        path.replaceWithMultiple(specifiers.map(ele => genImportDeclaration(ele, libraryName)))
      }
    }
  }
}