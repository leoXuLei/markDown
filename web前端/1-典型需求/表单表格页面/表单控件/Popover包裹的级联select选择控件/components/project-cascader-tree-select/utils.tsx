export function mapTree(node, cb, fieldName = 'children', parent = null) {
  return cb(
    {
      ...node,
      [fieldName]: node[fieldName]
        ? node[fieldName].map((item) => mapTree(item, cb, fieldName, node)).filter((it) => !!it)
        : undefined,
    },
    parent,
  )
}
