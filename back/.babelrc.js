module.exports = api => {
  api.cache(true)

  const presets = ['@babel/env', '@babel/typescript']

  return {
    presets,
  }
}
