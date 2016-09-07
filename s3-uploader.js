var AWS = require('aws-sdk');

AWS.config.loadFromPath('./config.json');

var s3 = new AWS.S3();

 s3.createBucket({Bucket: 'myBucketwowdoge'}, function() {

  var params = {Bucket: 'myBucketwowdoge', Key: 'suchwowdoge', Body: 'OMG! A Doge!'};

  s3.putObject(params, function(err, data) {

      if (err)

          console.log(err)

      else       console.log("Successfully uploaded data to myBucket/myKey");

   });

});
