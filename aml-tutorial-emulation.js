// this program will follow the Amazon Machine Learning tutorial at http://docs.aws.amazon.com/machine-learning/latest/dg/tutorial.html , and enact each step in Node

var AWS = require('aws-sdk'),
    fs = require('fs'),
    s3 = new AWS.S3(),
    machinelearning = new AWS.MachineLearning();;

AWS.config.loadFromPath('./config.json');

// Step 1: Prepare Your Data

// CSV files have been loaded to docs/ folder
//  upload the files to an Amazon S3 location

s3.createBucket({Bucket: 'aml-tutorial-emulation-files'}, function() {

  var banking_params = {
    Bucket: 'aml-tutorial-emulation-files',
    Key: 'banking',
    Body: fs.createReadStream('./docs/banking.csv')
  };

  var batch_params = {
    Bucket: 'aml-tutorial-emulation-files',
    Key: 'banking-batch',
    Body: fs.createReadStream('./docs/banking-batch.csv')
  };

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

var create_data_source_params = {
  DataSourceId: 'Banking Data Source ID',
  // A user-supplied identifier that uniquely identifies the DataSource.
  DataSpec: {
    DataLocationS3: 's3://' + banking_params.Bucket + "/banking.csv",
     // The Amazon S3 location of the observation data.
     // !!! Not sure if this is the correct format !!!
    DataRearrangement: JSON.stringify({
      "splitting":{
        "percentBegin":70,
        "percentEnd":100,
        "strategy":"sequential",
        "complement":"true"
      }
    }),
    // A JSON string that represents the splitting and rearrangement processing to be applied to a DataSource. If the DataRearrangement parameter is not provided, all of the input data is used to create the Datasource.
    // it's a good idea to shuffle the data - strategy "random"
    // This is where we enact the 70/30 training/evaluation split
    DataSchema: JSON.stringify({
        "version": "1.0",
        "targetAttributeName": "y",
        "dataFormat": "CSV",
        "dataFileContainsHeader": true,
        "attributes": [
            {
                "attributeName": "age",
                "attributeType": "NUMERIC"
            },
            {
                "attributeName": "job",
                "attributeType": "CATEGORICAL"
            },
            {
                "attributeName": "marital",
                "attributeType": "CATEGORICAL"
            },
            {
                "attributeName": "education",
                "attributeType": "CATEGORICAL"
            },
            {
                "attributeName": "default",
                "attributeType": "BINARY"

            },
            {
                "attributeName": "housing",
                "attributeType": "BINARY"

            },
            {
                "attributeName": "loan",
                "attributeType": "BINARY"

            },
            {
                "attributeName": "contact",
                "attributeType": "CATEGORICAL"
            },
            {
                "attributeName": "month",
                "attributeType": "CATEGORICAL"
            },
            {
                "attributeName": "day_of_week",
                "attributeType": "CATEGORICAL"
            },
            {
                "attributeName": "duration",
                "attributeType": "NUMERIC"
            },
            {
                "attributeName": "campaign",
                "attributeType": "NUMERIC"
            },
            {
                "attributeName": "pdays",
                "attributeType": "NUMERIC"
            },
            {
                "attributeName": "previous",
                "attributeType": "NUMERIC"
            },
            {
                "attributeName": "poutcome",
                "attributeType": "BINARY"

            },
            {
                "attributeName": "emp_var_rate",
                "attributeType": "NUMERIC"

            },
            {
                "attributeName": "cons_price_idx",
                "attributeType": "NUMERIC"
            },
            {
                "attributeName": "cons_conf_idx",
                "attributeType": "NUMERIC"
            },
            {
                "attributeName": "euribor3m",
                "attributeType": "NUMERIC"

            },
            {
                "attributeName": "nr_employed",
                "attributeType": "NUMERIC"
            },
            {
                "attributeName": "y",
                "attributeType": "BINARY"
            }
        ]
    }),
//!!! Not yet confirmed !!!
    // A JSON string representing the schema.
    // instead of DataSchema, you may provide:
    // DataSchemaLocationS3: 'STRING_VALUE'
    // The Amazon S3 location of the DataSchema
    // ? How to extract schema from first line of csv ?
  },
  ComputeStatistics: true,
  // necessary to get useful data later
  DataSourceName: 'Banking Data Souce Name'
  // A user-supplied name or description of the DataSource.
  // ? How is this different from the DataSourceID ?
};

machinelearning.createDataSourceFromS3(create_data_source_params, function(err, data) {
  if (err) console.log(err, err.stack);
  else     console.log(data);
});
