var mongoose = require("mongoose");
var Amzlisting = mongoose.model("Amzlisting");

exports.generate = async function (req, res) {
  let docs = [];
  for (let data of req.body) {
    let newDoc = {};
    for (const [key, value] of Object.entries(data)) {
      if (key.startsWith("Quantity ")) {
        if (!newDoc.QuantityPrice) newDoc.QuantityPrice = {};
        newDoc.QuantityPrice[key] = value;
      } else if (key.startsWith("Progressive ")) {
        if (!newDoc.ProgressivePrice) newDoc.ProgressivePrice = {};
        newDoc.ProgressivePrice[key] = value;
      } else {
        newDoc[key] = value;
      }
    }
    docs.push(newDoc);
  }
  try {
    let result = await Amzlisting.insertMany(docs, { ordered: false });
    return res.jsonp(result);
  } catch (err) {
    return res.status(400).send({ message: err.message });
  }
};

exports.list = async function (req, res) {
  const data = await Amzlisting.find({});
  return res.jsonp(data);
};
