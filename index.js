const fs = require('fs');
const path = require('path');
const async = require('async');
const tots = require('json-tots');
const xml = require('xml-js');
const xls = require('xls-to-json');
const moment = require('moment-timezone');

/* 
    This parsing process is after to stablish with the Shippify dev team 
    the method to upload the file to Shippify Servers.
    The params [fileData[String as utf8] and fileExtension['xml'|'xls','csv'...] ] 
    are provided by the Shippify System after to read the file in the Shippify Servers.
    The time to upload the files and also the scheduled date 
    for the deliveries needs to be stablish with Shippify Dev team.
    Contact to Shippify Dev team by email: ''
*/ 

function parser(filePath, template, cb){

	async.waterfall([
		(cb)=>{
			const extension = path.extname(filePath);

			//Parsing to JSON Object
			switch( extension ) {
			case '.json': //The data already is a JSON Object.
				try{
					const fileData = fs.readFileSync(filePath, 'utf8');
					const document = JSON.parse(fileData);
					return cb(null, document, 'object');
				}catch(error){
					return cb(error);
				}
			case '.xml':
				try{
					const fileData = fs.readFileSync(filePath, 'utf8');
					const resultAsString = xml.xml2json(fileData, { compact: true });
					const document = JSON.parse(resultAsString);
					return cb(null, document, 'object');
				}catch(error){
					return cb(error);
				}
			case '.xls':
			case '.csv':
				xls({
					input: filePath,  // input xls
					output: null
				}, (error, document)=>{
					if(error) {
						return cb(error);
					} 
					return cb(null, document, 'array');
				});
				break;
			default:
				cb(new Error('This fileExtension is not supported yet'));
				break;
			}
		},
		(jsonObject, output, cb)=>{
			//The template is configurated by each company. It use the JSONPath Syntax.
			const customFns = {
				functions: { pickupDateFn , rangeAndMapFn}, args:template.args
			}

			const jsonArr = !Array.isArray(jsonObject)? [jsonObject] : jsonObject;

			const documentProcessed = jsonArr.map((jsonItem) => {
				return tots.transform(template.template, customFns)(jsonItem);
			});

			console.log('DELIVERIES PROCESSED : ',JSON.stringify(documentProcessed, null, 2));

			if (output == 'object') {
				return cb(null, documentProcessed[0]);
			}

			return cb(null, documentProcessed);
		}	
	], (error, dataParsed)=>{
		if(error){
			return cb(error);
		}
		cb(null, dataParsed);
	});
}

/* Helper methods */
const pickupDateFn = (zone, city, days, hour) => {
	return moment.tz(`${zone}/${city}`).add(days, 'days').hour(hour).minute(0).second(0).millisecond(0).valueOf();
} 


const rangeAndMapFn = (number, compareTable, mapTable, inclusive) => {
	const weightNumber = Number.parseInt(number);
  
	for(i=0;i<compareTable.length;i++){
	  if((inclusive && weightNumber<=compareTable[i]) || (!inclusive && weightNumber<compareTable[i])){
		return mapTable[i];
	  }
	}
  
	  return mapTable[i];
} 

module.exports = parser;


