module.exports = function ({ types: t }) {
  const genImportDeclaration = (specifier, libraryName) => {
    return t.importDeclaration(
      [t.importDefaultSpecifier(specifier.local)],
      t.stringLiteral(`${libraryName}/${specifier.imported.name.replace(/^./, s => s.toLowerCase())}`)
    )
  }
  return {
    // 访问者模式, 通过对AST的遍历对访问到的ImportDeclaration作处理
    visitor: {
      // 筛选特征1
      ImportDeclaration(path, { opts: { libraryName } }) {
        // 如果没有指定moduleName
        if (!libraryName) return
        // 如果语句的source value不为libraryName
        if (path.node.source.value !== libraryName) return
        const { specifiers } = path.node
        // 筛选特征
        const allImportSpecifier = specifiers.every(ele => ele.type === 'ImportSpecifier')
        if (!allImportSpecifier) return
        // 遍历所有specifier, 将其属性传入genImportDeclaration函数生成一个或多个ImportDeclaration
        const ImportDeclarations = specifiers.map(ele => genImportDeclaration(ele, libraryName))
        // 替换原来的ImportDeclaration
        path.replaceWithMultiple(ImportDeclarations)
      }
    }
  }
}