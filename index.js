const fs = require('fs');
const path = require('path');
const async = require('async');
const tots = require('json-tots');
const xml = require('xml-js');
const xls = require('xls-to-json');

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
					return cb(null, document);
				}catch(error){
					return cb(error);
				}
			case '.xml':
				try{
					const fileData = fs.readFileSync(filePath, 'utf8');
					const resultAsString = xml.xml2json(fileData, { compact: true });
					const document = JSON.parse(resultAsString);
					return cb(null, document);
				}catch(error){
					return cb(error);
				}
			case '.xls':
				xls({
					input: filePath,  // input xls
				}, (error, document)=>{
					if(error) {
						return cb(error);
					} 
					return cb(null, document);
				});
				break;
			default:
				cb(new Error('This fileExtension is not supported yet'));
				break;
			}
		},
		(jsonObject, cb)=>{
			//The template is configurated by each company. It use the JSONPath Syntax.
			const documentProcessed = tots.transform(template.template)(jsonObject);
			console.log('DELIVERIES PROCESSED : ',JSON.stringify(documentProcessed, null, 2));
			return cb(null, documentProcessed);
		}	
	], (error, dataParsed)=>{
		if(error){
			return cb(error);
		}
		cb(null, dataParsed);
	});
}

module.exports = parser;


