//Try to understand this better refering back to the help topic.
module.exports = func => {
   return (req, res, next) => {
      func(req, res, next).catch(next)
   }
}