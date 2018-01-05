
const reduceList = (arr,condition) => {
  return arr.reduce((acc,val) => {
    acc.push(val[condition])
    return acc;
  },[])
}




module.exports = {
  reduceList
}
