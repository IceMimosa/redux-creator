/**
 * 获取值获取抛出异常
 * 
 * @param {Any} value 值
 * @param {String} error 错误信息
 */
export const getOrThrow = (value, error) => {
  if (value === undefined || value === '') {
    throw new Error(error || 'Missing value')
  }
  return value;
}