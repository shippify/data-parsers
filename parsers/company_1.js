const convert = require('xml-js');

// Custom parser example for the company with id = 2 from a xml file.
module.exports = function(fileData, fileExtension, cb){

	const result = convert.xml2json(fileData, {compact: true});
	const resultJSON = JSON.parse(result);

	//Extracting information from the XML to create the JSON with delivery data

	//=======================================================================
	//---------------------------Reference Id or Order Id--------------------------
	//=======================================================================

	//order id,  it's used 
	const referenceId = resultJSON.nfeProc.NFe.infNFe.ide.cNF._text;

	//=======================================================================
	//---------------------------Pickup Information--------------------------
	//=======================================================================

	//Sender information
	const pickupContact = {
		name : resultJSON.nfeProc.NFe.infNFe.transp.transporta.xNome._text,
		phone : '5400000000',
		email : 'example@shippify.co'
	}; 

	//Pickup Address components
	const xEnder = resultJSON.nfeProc.NFe.infNFe.transp.transporta.xEnder._text;
	const xMun1 = resultJSON.nfeProc.NFe.infNFe.transp.transporta.xMun._text;
	const xCpl1 = resultJSON.nfeProc.NFe.infNFe.transp.transporta.UF._text;

	const pickupAddressComponents = [];
	pickupAddressComponents.push(xEnder);
	pickupAddressComponents.push(xMun1);
	pickupAddressComponents.push(xCpl1);

	const pickupAddressComposed = pickupAddressComponents.join(', ');

	//=======================================================================
	//---------------------------Dropoff Information-------------------------
	//=======================================================================
    
	//Recipient information
	const deliveryContact = {
		name : resultJSON.nfeProc.NFe.infNFe.dest.xNome._text,
		phone : resultJSON.nfeProc.NFe.infNFe.dest.enderDest.fone._text, //+1990796802
		email : resultJSON.nfeProc.NFe.infNFe.dest.email._text,
	};

	//Delivery Address components
	const xLgr = resultJSON.nfeProc.NFe.infNFe.dest.enderDest.xLgr._text;
	const nro = resultJSON.nfeProc.NFe.infNFe.dest.enderDest.nro._text;
	const xCpl = resultJSON.nfeProc.NFe.infNFe.dest.enderDest.xCpl._text;
	const xBairro = resultJSON.nfeProc.NFe.infNFe.dest.enderDest.xBairro._text;
	const cMun = resultJSON.nfeProc.NFe.infNFe.dest.enderDest.cMun._text;
	const xMun = resultJSON.nfeProc.NFe.infNFe.dest.enderDest.xMun._text;
	const UF = resultJSON.nfeProc.NFe.infNFe.dest.enderDest.UF._text;
	const CEP = resultJSON.nfeProc.NFe.infNFe.dest.enderDest.CEP._text;

	const addressComponents = [];
	addressComponents.push(xLgr);
	addressComponents.push(nro);
	addressComponents.push(xCpl);
	addressComponents.push(xBairro);
	addressComponents.push(cMun);
	addressComponents.push(xMun);
	addressComponents.push(UF);
	addressComponents.push(`CEP ${CEP}`);
	// Join the address components as street, house number, neighborhood, city, country.
	const deliveryAddressComposed = addressComponents.join(', ');
	// If you can get the lat and lng also you can provide this information but however it's optional.
    
	//Additional information for the delivery address 

	const additionalInformation = resultJSON.nfeProc.NFe.infNFe.infAdic.infCpl._text;

	//=======================================================================
	//----------------------------------Packages-----------------------------
	//=======================================================================
    
	const packages =
    [   
    	{
    		id : resultJSON.nfeProc.NFe.infNFe.det.prod.cProd._text,
    		name : resultJSON.nfeProc.NFe.infNFe.det.prod.xProd._text,
    		size : 3,
    		qty : resultJSON.nfeProc.NFe.infNFe.det.prod.qCom._text?
    			parseInt(resultJSON.nfeProc.NFe.infNFe.det.prod.qCom._text): 1,
    	}
    ];
        
	//JSON MODEL FOR THE DELIVERY.
	const deliveriesJson = 
    {   
    	deliveries: [
    		{
    			pickup: {
    				contact: {
    					name: pickupContact.name, // [ No optional ]
    					phone: pickupContact.phone, // [ No optional, just by reverse logistic ]
    					email: pickupContact.email // [ No optional]
    				},
    				location: {
    					address: pickupAddressComposed, // [ No optional ]
    					lat: -46.63460793, //[ optional ]
    					lng: -23.5474351 // [ optional ]
    				}
    			},
    			dropoff:  {
    				contact: {
    					name: deliveryContact.name,  // [ No optional ]
    					phone: deliveryContact.fone, // [ Optional, just by reverse logistic ]
    					email: deliveryContact.email // [ No optional ]
    				},
    				location: {
    					address: deliveryAddressComposed, // [ No optional ]
    					instructions: additionalInformation
    					// lat: -34,45656656 [ optional ],
    					// lng: -23.5474351 [ optional ]
    				}
    			},
    			packages,   //[No optional]
    			referenceId
    			/* 
                    // [ No optional for integrations, very important to know what deliveries already created in Shippify ] 
                    Used to provided a unique company reference for the delivery. 
                    Maybe in your company it can be called as "order Id", "Nome de nota fiscal" 
                */
    		}
    	]
    };

	console.log('JSON SENT TO CREATE: ',JSON.stringify(deliveriesJson, null, 2));

	return cb(null, deliveriesJson);
};





