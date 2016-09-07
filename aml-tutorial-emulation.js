// this program will follow the Amazon Machine Learning tutorial at http://docs.aws.amazon.com/machine-learning/latest/dg/tutorial.html , and enact each step in Node

var AWS = require('aws-sdk');

AWS.config.loadFromPath('./config.json');

// Step 1: Prepare Your Data

// CSV files have been loaded to docs/ folder

//  upload the files to an Amazon S3 location


var s3 = new AWS.S3();

 s3.createBucket({Bucket: 'myBucketwowdoge'}, function() {
  var params = {
    Bucket: 'myBucketwowdoge',
    Key: 'suchwowdoge',
    Body: 'OMG! A Doge!'
  };

  s3.putObject(params, function(err, data) {
      if (err) {
          console.log(err)
      } else {
        console.log("Successfully uploaded data to myBucket/myKey");
      }

   });

});
