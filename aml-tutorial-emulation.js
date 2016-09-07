// This program will follow the Amazon Machine Learning tutorial at http://docs.aws.amazon.com/machine-learning/latest/dg/tutorial.html , and enact each step in Node

// currently in skeleton status, not able to be run

var AWS = require('aws-sdk'),
    fs = require('fs');

AWS.config.loadFromPath('./config.json');

var s3 = new AWS.S3(),
    machinelearning = new AWS.MachineLearning();

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

// all above code currently working
// ---
// all below code, not so much

// Step 2: Create a Training Datasource

var create_data_source_params = {
  DataSourceId: 'Banking-Data-Source-ID',
  // A user-supplied identifier that uniquely identifies the DataSource.
  DataSpec: {
    DataLocationS3: 's3://aml-tutorial-emulation-files/banking.csv' ,
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
  DataSourceName: 'Banking-Data-Souce-Name'
  // A user-supplied name or description of the DataSource.
  // ? How is this different from the DataSourceID ?
};

//this call may need to be nested after the initial S3 bucket load
machinelearning.createDataSourceFromS3(create_data_source_params, function(err, data) {
  if (err) console.log(err, err.stack);
  else     console.log(data);
});

//Step 3: Create a Machine Learning Model

//creating a ML Learning Model (from docs):
var params = {
  MLModelId: 'STRING_VALUE', /* required */
  // A user-supplied ID that uniquely identifies the MLModel.
  MLModelType: 'REGRESSION | BINARY | MULTICLASS', /* required */
  // Classification option; aka: numeric value | 1 or 0 | limited set
  TrainingDataSourceId: 'STRING_VALUE', /* required */
  // from step 2
  MLModelName: 'STRING_VALUE',
  // A user-supplied name or description of the MLModel.
  Parameters: {
    someKey: 'STRING_VALUE'
    // see docs for options
  },
  Recipe: 'STRING_VALUE',
  RecipeUri: 'STRING_VALUE'
  // choose one of the 2 above, otherwise AML creates a default
};
machinelearning.createMLModel(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});

// ???: if you chain asynchronous methods off the same object, will each method wait until the previous is completed?


// Step 4: Review the ML Model's Predictive Performance and Set a Score Threshold

// calling up an Evaluation (from docs):
var params = {
  EvaluationDataSourceId: 'STRING_VALUE', /* required */
  // The ID of the DataSource for the evaluation. Schema must match the MLModelID's (below) schema
  EvaluationId: 'STRING_VALUE', /* required */
  // A user-supplied ID that uniquely identifies the Evaluation.
  MLModelId: 'STRING_VALUE', /* required */
  // The ID of the MLModel to evaluate.
  EvaluationName: 'STRING_VALUE'
  // A user-supplied name or description of the Evaluation.
};
machinelearning.createEvaluation(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});

// getting an Evaluation that has been completed
var params = {
  EvaluationId: 'STRING_VALUE' /* required */
  // The ID of the Evaluation to retrieve.
};
machinelearning.getEvaluation(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});

//to update the score Threshold (from docs):
// will want to run another Evaluation after updating Threshold
var params = {
  MLModelId: 'STRING_VALUE', /* required */
  // The ID assigned to the MLModel during creation.
  MLModelName: 'STRING_VALUE',
  // A user-supplied name or description of the MLModel.
  ScoreThreshold: 0.5
  // set higher = stricter, more false negatives
  // set lower = looser, more false positives
};
machinelearning.updateMLModel(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});

// Step 5: Use the ML Model to Generate Predictions

//calling a new Batch Prediction (from docs):
var params = {
  BatchPredictionDataSourceId: 'STRING_VALUE', /* required */
  // The ID of the DataSource that points to the group of observations to predict.
  BatchPredictionId: 'STRING_VALUE', /* required */
  // A user-supplied ID that uniquely identifies the BatchPrediction.
  MLModelId: 'STRING_VALUE', /* required */
  // The ID of the MLModel that will generate predictions for the group of observations.
  OutputUri: 'STRING_VALUE', /* required */
  // The location of an S3 bucket or directory to store the batch prediction results. (permissions required)
  BatchPredictionName: 'STRING_VALUE'
  // user-supplied name or description of the BatchPrediction
};
machinelearning.createBatchPrediction(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});

// checking out an existing Batch Prediction (docs)
var params = {
  BatchPredictionId: 'STRING_VALUE' /* required */
  // An ID assigned to the BatchPrediction at creation.
};
machinelearning.getBatchPrediction(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});

// Creating a Real-Time endpoint (docs):
// WARNING: charges accumulate by the hour (as well as by-request) while active (though still cheap overall)
var params = {
  MLModelId: 'STRING_VALUE' /* required */
  // The ID assigned to the MLModel during creation.
};
machinelearning.createRealtimeEndpoint(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});

// ??? How do we enter real-time prediction queries?
// ??? Does an entry point also appear at the endpoint?

// Step 6: Clean Up

// Delete functions exist for each object that was created
// Only essential one to delete is Real-Time Endpoint, as it accumulates charges by the hour

