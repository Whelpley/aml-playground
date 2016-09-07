var AWS = require('aws-sdk');

// AWS.config.loadFromPath('./config.json');

// need to have access to AWS in order to create an object!
// DANGER! hard-coded credentials
var s3 = new AWS.S3(
{
  accessKeyId: "AKIAJHTNVVNL3JJQJSDQ",
  secretAccessKey: "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",
  region: "us-east-1"
}
);

 s3.createBucket({Bucket: 'myBucketwow'}, function() {

  var params = {Bucket: 'myBucketwow', Key: 'myKeywow', Body: 'OMG!'};

  s3.putObject(params, function(err, data) {

      if (err)

          console.log(err)

      else       console.log("Successfully uploaded data to myBucket/myKey");

   });

});

 // get this working
 // then try AML API -
 // building for programmers
 //objectives:
 // -should create a "training data" object - an array (probably, maybe an object) of data
 // var trainingdata = []
 //   -emulate structure from example
 //