// this program will follow the Amazon Machine Learning tutorial at http://docs.aws.amazon.com/machine-learning/latest/dg/tutorial.html , and enact each step in Node

var AWS = require('aws-sdk'),
    fs = require('fs');

AWS.config.loadFromPath('./config.json');

// Step 1: Prepare Your Data

// CSV files have been loaded to docs/ folder
//  upload the files to an Amazon S3 location

var s3 = new AWS.S3();

 s3.createBucket({Bucket: 'aml-tutorial-emulation-files'}, function() {

  var banking_params = {
    Bucket: 'aml-tutorial-emulation-files',
    //is this a good key name? separate for each params?
    Key: 'banking',
    // how to access the 2 files and put them in the Body?
    Body: fs.createReadStream('./docs/banking.csv')
  };

  var batch_params = {
    Bucket: 'aml-tutorial-emulation-files',
    //is this a good key name? separate for each params?
    Key: 'banking-batch',
    // how to access the 2 files and put them in the Body?
    Body: fs.createReadStream('./docs/banking-batch.csv')
  };

//will I need a separate call for each object?
  s3.putObject(banking_params, function(err, data) {
      if (err) {
        console.log(err)
      } else {
        console.log(
          "Successfully uploaded data to "
          + banking_params.Bucket
          + "/"
          + banking_params.Key);
      }
   });

  s3.putObject(batch_params, function(err, data) {
      if (err) {
        console.log(err)
      } else {
        console.log(
          "Successfully uploaded data to "
          + batch_params.Bucket
          + "/"
          + batch_params.Key);
      }
   });
});

// Step 2: Create a Training Datasource

