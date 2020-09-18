const mem = {}
function add (name, func) {
  const list = mem[name] || []
  const index = list.indexOf(func)
  if (index < 0) {
    list.push(func)
    mem[name] = list
  }
}
function remove (name, func) {
  const list = mem[name] || []
  const index = list.indexOf(func)
  if (index >= 0) {
    list.splice(index, 1)
    mem[name] = list
  }
}
function emit (name, data) {
  const list = [].concat(mem[name] || [])
  list.forEach(f => f(data))
}

export const msignal = {
  add, remove, emit
}
export default msignal
