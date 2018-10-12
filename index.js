const jsonParseExample = require('./parsers/company_1.js');

/* 
    This parsing process is after to stablish with the Shippify dev team 
    the method to upload the file to Shippify Servers.
    The params [ companyId, fileData[String as utf8] and fileExtension['xml'|'xls','csv'...] ] 
    are provided by the Shippify System after to read the file in the Shippify Servers.
    The time to upload the files and also the scheduled date 
    for the deliveries needs to be stablish with Shippify Dev team.
    Contact to Shippify Dev team by email: ''
*/ 

function parser(companyId, fileData, fileExtension, cb){

	//The company Id.
	switch(companyId) {
	case 1:
		jsonParseExample(fileData, fileExtension, (error, deliveryJson)=>{
			if(error){
				return cb(error);
			}
			cb(null, deliveryJson);
		});
		break;
	default:
		cb(new Error('This company is not support for this parser'));
		break;
	}

}

module.exports = parser;


