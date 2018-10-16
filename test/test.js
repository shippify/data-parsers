const fs = require('fs');
const path = require('path');
const inspector = require('schema-inspector');
const parser = require('./../index.js');
const DeliverySchema = require('./../schema.js');

function validator(json, done){
	var sanitization = DeliverySchema.deliverySanitizationSchema();
	inspector.sanitize(sanitization, json);
	var validation = DeliverySchema.deliveryValidationSchema();
	return inspector.validate(validation, json, function(error, result){
		if(error){
			return done(error);
		}
		if(result && !result.valid){
			return done(result.format());
		}
		done();
	});
}

describe('Parser', function() {
	describe('Example1[xml]', function() {
		it('should return true when the json is valid', function(done) {
			var companyId = 1;
			var examplePath = path.join(__dirname, '..', 'test-files', 'example1', 'example1.xml');
			var templatePath = path.join(__dirname, '..', 'test-files', 'example1', 'template1.json');
			var templateAsString = fs.readFileSync(templatePath, 'utf8')
			var template = JSON.parse(templateAsString);

			parser(examplePath, template, function(error, deliveriesJson){
				//If exists an error then it is not valid
				if(error){
					return done(error);
				}
				//Checking the json structure with the delivery schema.
				validator(deliveriesJson, done);
			});
		});
	});
});