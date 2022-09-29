"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AmzlistingSchema = new Schema({
  sku: String,
  asin: String,
  price: Number,
  quantity: Number,
  // business account prices
  businessPrice: Number,
  QuantityPrice: Schema.Types.Mixed,
  ProgressivePrice: Schema.Types.Mixed,
});

mongoose.model("Amzlisting", AmzlistingSchema);
