const moment = require('moment');
const sizes = ['xs','s','m','l','xl'];

function escapeSpecialCharacters(str) {
	return str
		.replace(/[\\]/g, ' ')
		.replace(/[\"]/g, ' ')
		.replace(/[\']/g, ' ')
		.replace(/[\/]/g, ' ')
		.replace(/[\b]/g, ' ')
		.replace(/[\f]/g, ' ')
		.replace(/[\n]/g, ' ')
		.replace(/[\r]/g, ' ')
		.replace(/[\t]/g, ' ');
}

module.exports.deliverySanitizationSchema = function() {
	return {
		type: 'object',
		properties: {
			deliveries: {
				type: 'array',
				optional: false,
				items: {
					type: 'object',
					properties: {
						pickup: {
							type: 'object',
							properties: {
								contact: {
									type: 'object',
									optional: false,
									properties: {
										name: {type: 'string', minLength: 1, rules: ['trim', 'title'], optional: true },
										email: {type: 'string', minLength: 1, rules: 'trim', optional: true },
										phonenumber: {type: 'string', minLength: 1, rules: 'trim', optional: true,
											exec: function(_, value){
												if(value && (typeof value === 'string')){
													return value.replace(/ /g, '');
												}
											}
										}
									}
								},
								location: {
									type: 'object',
									properties: {
										address: { type: 'string', optional: true, rules: 'trim' },
										instructions: {type: 'string', optional: true, rules: 'trim'},
										lat: {type: 'number', optional: true},
										lng: {type: 'number', optional: true},
										warehouse: { type: 'integer', optional: true }
									}
								},
								date: {
									type: 'string',
									optional: true
								}
							}
						},
						dropoff: {
							type: 'object',
							properties: {
								contact: {
									type: 'object',
									optional: false,
									properties: {
										name: {type: 'string', minLength: 1, rules: ['trim', 'title'], optional: true },
										email: {type: 'string', minLength: 1, rules: 'trim', optional: true },
										phonenumber: {type: 'string', minLength: 1, rules: 'trim', optional: true,
											exec: function(_, value){
												if(value && (typeof value === 'string')){
													return value.replace(/ /g, '');
												}
											}
										}
									}
								},
								location: {
									type: 'object',
									properties: {
										address: { type: 'string', optional: true, rules: 'trim' },
										instructions: {type: 'string', optional: true, rules: 'trim'},
										lat: {type: 'number', optional: true},
										lng: {type: 'number', optional: true},
										warehouse: { type: 'integer', optional: true }
									}
								},
								date: {
									optional: true,
									type: 'string',
								}
							}
						},
						packages: {
							type: 'array',
							optional: false,
							items: {
								type: 'object',
								optional: false,
								properties: {
									id: { type: 'string', optional: true, rules: 'trim' },
									name: { type: 'string', optional: false, rules: 'trim' },
									price: {
										type: ['string', 'number'],
										optional: false, def: 0, rules: 'trim',
										exec: function (_, value) {
											const qtyValue = parseFloat(value);
											if (qtyValue >= 0) {
												return qtyValue;
											}
											return 0;
										}
									},
									qty: {type: ['integer', 'string', 'number'], optional: false,
										exec: function (_, value) {
											const qtyValue = parseInt(value);
											if (qtyValue > 0) {
												return qtyValue;
											}

											return 1;
										}
									},
									size: {
										type: ['string','integer'],
										optional: false,
										rules: ['trim', 'lower'],
										exec: function (_, value) {
											if(value === '' || value === undefined){
												return -1;
											}
											if(isNaN(value)){
												const index = sizes.indexOf(value);
												if(index !== -1){
													return index+1;
												}
												return index;
											}
											return Number(value);
										}
									},
									fragile: { type: 'boolean', optional: false, def: false },
									extraInsurance: {
										type: 'object',
										optional: true,
										properties: {
											amount: { type: 'number', optional: false }
										}
									}
								}
							}
						},
						quoteId: { type: 'integer', optional: true },
						referenceId: { type: 'string', optional: true, rules: 'trim' },
						cod: { type: 'numeric', optional: true },
						metadata: { type: 'object', optional: true },
						sendEmail: { type: 'boolean', optional: false, def: false },
						sendSMS: { type: 'boolean', optional: false, def: false },
						requiresReturn: { type: 'boolean', optional: false, def: false }
					}
				}
			},
			limit: {type: 'integer', max: 10, optional: false, def: 3 },
			quoteId: {type: 'integer', optional: true},
		}
	};
};
module.exports.deliveryValidationSchema = function(skipDateValidation = false) {
	const now = moment();
	const minTimeInMinutesLimit = 60; // An hour in minutes
	const maxTimeInMinutesLimit = 43200; //30*24*60 A month in minutes
	const maxTimeGapMinuteLimit = 1440; // 24*60 A day in minutes

	return {
		type: 'object',
		properties: {
			deliveries: {
				type: 'array',
				exec: function (_, value) {
					if (typeof value === 'undefined' || value.length === 0) {
						this.report(' Body must contain at least one element.');
					}
				},
				items: {
					type: 'object',
					properties: {
						pickup: {
							type: 'object',
							properties: {
								date: {
									type: 'string',
									optional: true,
									exec: function (s, d) {
										if (typeof d === 'undefined') {
											return null;
										}
										try{
											const number = `${d}`.length;
											const date = number <= 10? moment.unix(Number(d)):moment(new Date(Number(d)));
											let timeDiff = date.diff(now, 'minutes');
											if (timeDiff <= 0){
												this.report('Pickup time invalid. Time should be at least 60 minutes later than current time.');
												return;
											}
											if(!skipDateValidation){
												if(timeDiff < minTimeInMinutesLimit) {
													this.report('Pickup time provided is too close to current time. Time should be at least 60 minutes later than current time.');
													return;
												}
												else if(timeDiff > maxTimeInMinutesLimit){
													this.report('Pickup time provided is after a month from current time. Time should be scheduled with a month in advance at the latest.');
													return;
												}
											}
											return date.toDate().getTime();
										}
										catch(error){
											this.report();
											return '__INVALID__DATE__LIMIT__';
										}
									}
								},
								location: {
									type: 'object',
									optional: true,
									exec: validateLocation
								},
								contact: {
									type: 'object',
									optional: false,
									properties: {
										name: {type: 'string', optional: true },
										email: {type: 'string', optional: true },
										phonenumber: {type: 'string', minLength: 1, optional: true }
									},
									exec: function(_, value){
										if(value){
											if(typeof value.name !== 'undefined' && typeof value.email === 'undefined' && typeof value.phonenumber === 'undefined'){
												this.report('Parameter \'dispatcher\' if included, must contain a \'name\' atribute and either a \'phonenumber\' or an \'email\'.');
											}
										}
									}
								}
							}
						},
						dropoff: {
							type: 'object',
							properties: {
								date: {
									type: 'string',
									optional: true,
									exec: function (s, d) {
										if (typeof d === 'undefined') {
											return null;
										}
										try{
											const number = `${d}`.length;
											const date = number <= 10? moment.unix(Number(d)):moment(new Date(Number(d)));
											return date.toDate().getTime();
										}
										catch(error){
											this.report();
											return '__INVALID__DATE__LIMIT__';
										}
									}
								},
								location: {
									type: 'object',
									optional: true,
									exec: validateLocation
								},
								contact: {
									type: 'object',
									optional: false,
									properties: {
										name: {type: 'string', optional: true },
										email: {type: 'string', optional: true },
										phonenumber: {type: 'string', optional: true }
									},
									exec: function(_, value){
										if(value){
											if(typeof value.name !== 'undefined' && typeof value.email === 'undefined' && typeof value.phonenumber === 'undefined'){
												this.report('Parameter \'recipient\' if included, must contain a \'name\' atribute and either a \'phonenumber\' or an \'email\'.');
											}
										}
									}
								}
							}
						},
						packages: {
							type: 'array',
							optional: false,
							exec: function (schema, value) {
								if (typeof value === 'undefined' || value.length === 0) {
									this.report('Parameter \'packages\' if included, must contain at least one element.');
								}
							},
							items: {
								type: 'object',
								optional: false,
								properties: {
									id: {
										type: 'string',
										optional: true,
										rules: ['trim'],
										exec: function (_, value) {
											if(value){
												return escapeSpecialCharacters(value.trim()) || '0';
											}
											return value;
										}
									},
									name: {
										type: 'string',
										rules: ['trim'],
										exec: function (_, value) {
											return escapeSpecialCharacters(value.trim());
										}
									},
									qty: {type: 'integer', optional: false},
									size: {
										type: 'integer',
										optional: false,
										exec: function(s, d){
											if (d < 1 || d > 5) {
												this.report('must be a valid size. [xs, s, m, l, xl]');
											}
										}
									},
									price: {
										type: 'number',
										optional: false, def: 0, rules: 'trim'
									}
								}
							}
						},
						sendEmail: {
							type: ['boolean', 'string'], optional: false, def: false,
							exec: function(_, value){
								return (value == 'true' || value == '1');
							}
						},
						sendSMS: {
							type: ['boolean', 'string'], optional: false, def: false,
							exec: function(_, value){
								return (value == 'true' || value == '1');
							}
						},
						requiresReturn: {
							type: ['boolean', 'string'], optional: false, def: false ,
							exec: function(_, value){
								return (value == 'true' || value == '1');
							}
						}
					},
					exec: function (_, value) {
						let pickup_date = value.pickup?value.pickup.date:undefined;
						let dropoff_date = value.dropoff?value.dropoff.date:undefined;

						if (pickup_date == 'undefined' || dropoff_date == 'undefined') {
							return;
						}
						if(value.metadata!=undefined){
							if(Object.keys(value.metadata).some((key) => value.metadata[key].length >100)){
								this.report('Your metadata object should includes only values with max. length of 100 characters.');
								return;
							}
						}

						try{
							const pickup = moment(new Date(Number(pickup_date)));
							const dropoff = moment(new Date(Number(dropoff_date)));
							let timeDiff = dropoff.diff(pickup, 'minutes');
							if (timeDiff <= 0){
								this.report('Dropoff time invalid. Dropoff time should be at least one hour later than pickup time.');
								return;
							}
							else if(timeDiff < minTimeInMinutesLimit){
								this.report('Dropoff time provided is too close to pickup time. Dropoff time should be at least one hour later than pickup time.');
								return;
							}
							else if(timeDiff > maxTimeGapMinuteLimit) {
								this.report('Dropoff Time provided is later than a day for pickup time. Time should be scheduled for the same day.');
								return;
							}
						}
						catch(error){
							this.report();
							return '__INVALID__DATE__LIMIT__';
						}
					}
				}
			},
			quoteId: {type: 'integer', optional: true}
		}
	};
};

module.exports.deliveryOptSanitizationSchema = function(){
	return {
		type: 'object',
		properties: {
			pickup: {
				type: 'object',
				optional: true,
				properties: {
					contact: {
						type: 'object',
						optional: true,
						properties: {
							email: {type: 'string', minLength: 1, optional: true},
							name: { type: 'string', optional: true },
							phonenumber: { type: 'string', optional: true }
						}
					},
					location: {
						type: 'object',
						optional: true,
						properties: {
							address: {type: 'string', optional: true},
							instructions: {type: 'string', optional: true},
							lat: {type: 'number', optional: true},
							lng: {type: 'number', optional: true}
						}
					},
				}
			},
			dropoff: {
				type: 'object',
				optional: true,
				properties: {
					contact: {
						type: 'object',
						optional: true,
						properties: {
							name: { type: 'string', optional: true },
							email: { type: 'string', optional: true },
							phonenumber: { type: 'string', optional: false }
						}
					},
					location: {
						type: 'object',
						optional: true,
						properties: {
							address: {type: 'string', optional: true},
							instructions: {type: 'string', optional: true},
							lat: {type: 'number', optional: true},
							lng: {type: 'number', optional: true}
						}
					}
				}
			},
			packages: {
				type: 'array',
				optional: true,
				package: {
					type: 'object',
					optional: true,
					properties: {
						name: {
							type: 'string',
							rules: ['trim'],
							exec: function (_, value) {
								return escapeSpecialCharacters(value.trim());
							}
						},
						qty: {type: 'integer', def: 1},
						size: {
							type: 'string',
							optional: false,
							rules: ['trim', 'lower'],
							exec: function (s, d) {
								var index = sizes.indexOf(d);
								if (index === -1) {
									this.report();
									return -1;
								}
								return (index + 1);
							}
						},
						id: {
							type: 'string',
							rules: ['trim'],
							exec: function (_, value) {
								return escapeSpecialCharacters(value.trim());
							}
						},
						fragile: {
							type: 'boolean',
							optional: false,
							def: false
						},
						extra_insurance: {
							type: 'object',
							properties: {
								price: {
									type: 'number',
									optional: true
								}
							}
						}
					}
				}
			},
			quoteId: { type: 'integer', optional: true },
			referenceId: { type: 'string', optional: true, rules: 'trim' },
			cod: { type: 'numeric', optional: true },
			metadata: { type: 'object', optional: true },
			sendEmail: { type: 'boolean', optional: false, def: false },
			sendSMS: { type: 'boolean', optional: false, def: false },
			requiresReturn: { type: 'boolean', optional: false, def: false }
		}
	};
};

module.exports.deliveryOptValidationSchema = function() {
	return{
		type: 'object',
		properties: {
			pickup: {
				type: 'object',
				optional: true,
				properties: {
					contact: {
						type: 'object',
						optional: true,
						properties: {
							email: {type: 'string', optional: true}
						}
					},
					location: {
						type: 'object',
						optional: true,
						properties: {
							address: {type: 'string', optional: true},
							instructions: {type: 'string', optional: true},
							lat: {type: 'number', optional: true},
							lng: {type: 'number', optional: true}
						}
					}
				}
			},
			dropoff: {
				type: 'object',
				optional: true,
				properties: {
					contact: {
						type: 'object',
						optional: true,
						exec: function(_, value){
							if(value){
								if(typeof value.name !== 'undefined' && typeof value.email === 'undefined' && typeof value.phonenumber === 'undefined'){
									this.report('Parameter \'recipient\' if included, must contain a \'name\' atribute and either a \'phonenumber\' or an \'email\'.');
								}
							}
						}
					},
					location: {
						type: 'object',
						optional: true,
						properties: {
							address: {type: 'string', optional: true},
							instructions: {type: 'string', optional: true},
							lat: {type: 'number', optional: true},
							lng: {type: 'number', optional: true}
						}
					}
				}
			},
			packages: {
				type: 'array',
				optional: true,
				package: {
					type: 'object',
					optional: true,
					properties: {
						name: {type: 'string', optional: true},
						qty: {type: 'integer', optional: false, def: 1},
						size: {
							type: 'integer',
							min: 1,
							max: 5,
							optional: false,
							exec: function(s, d){
								if (d === -1) {
									this.report('must be a valid size.');
								}
							}
						},
						id: {
							type: 'string',
							optional: true
						},
						fragile: {
							type: 'boolean',
							optional: false,
							def: false
						},
						extra_insurance: {
							type: 'object',
							properties: {
								price: {
									type: 'number',
									optional: true
								}
							}
						}
					}
				}
			},
			quoteId: { type: 'integer', optional: true },
			referenceId: { type: 'string', optional: true, rules: 'trim' },
			cod: { type: 'numeric', optional: true },
			metadata: { type: 'object', optional: true },
			sendEmail: { type: 'boolean', optional: false, def: false },
			sendSMS: { type: 'boolean', optional: false, def: false },
			requiresReturn: { type: 'boolean', optional: false, def: false }
		}
	};
};

module.exports.deliveryDropoffTracking = function() {
	return {
		type: 'object',
		properties: {
			id: {type: 'string', optional: false},
			contact: {
				type: 'object',
				optional: true,
				exec: function(_, value){
					if(value){
						if(typeof value.name !== 'undefined' && typeof value.email === 'undefined' && typeof value.phonenumber === 'undefined'){
							this.report('Parameter \'recipient\' if included, must contain a \'name\' atribute and either a \'phonenumber\' or an \'email\'.');
						}
					}
				}
			},
			location: {
				type: 'object',
				optional: true,
				properties: {
					address: {type: 'string', optional: true},
					instructions: {type: 'string', optional: true},
					lat: {type: 'number', optional: true},
					lng: {type: 'number', optional: true}
				}
			}
		}
	};
};

module.exports.deliveryDropoffWhatsapp = function() {
	return {
		type: 'object',
		properties: {
			id: {type: 'string', optional: false},
			contact: {
				type: 'object',
				optional: true,
				exec: function(_, value){
					if(value){
						if(typeof value.name !== 'undefined' && typeof value.email === 'undefined' && typeof value.phonenumber === 'undefined'){
							this.report('Parameter \'recipient\' if included, must contain a \'name\' atribute and either a \'phonenumber\' or an \'email\'.');
						}
					}
				}
			},
			mobile: {
				optional: true,
				type: 'string'
			},
			address: {type: 'string', optional: true},
			instructions: {type: 'string', optional: true},
			lat: {type: 'string', optional: false},
			lng: {type: 'string', optional: false}
		}
	};
};

module.exports.deliveryEditStop = function() {
	return{
		type: 'object',
		properties: {
			deliveryIds : {type: 'array', optional: false},
			deliveryChanges: {
				type: 'object',
				optional: false,
				properties: {
					contact: {
						type: 'object',
						optional: false,
						exec: function(_, value){
							if(value){
								if(typeof value.name !== 'undefined' && typeof value.email === 'undefined' && typeof value.phonenumber === 'undefined'){
									this.report('Parameter \'contact\' if included, must contain a \'name\' atribute and either a \'phonenumber\' or an \'email\'.');
								}
							}
						}
					},
					location: {
						type: 'object',
						optional: true,
						properties: {
							address: {type: 'string', optional: true},
							instructions: {type: 'string', optional: true},
							lat: {type: 'number', optional: true},
							lng: {type: 'number', optional: true}
						}
					},
					packages: {
						type: 'array',
						optional: true,
						package: {
							type: 'object',
							optional: true,
							properties: {
								name: {type: 'string', optional: true},
								qty: {type: 'integer', optional: false, def: 1},
								size: {
									type: 'integer',
									min: 1,
									max: 5,
									optional: false,
									exec: function(s, d){
										if (d === -1) {
											this.report('must be a valid size.');
										}
									}
								},
								id: {
									type: 'string',
									optional: true
								},
								fragile: {
									type: 'boolean',
									optional: false,
									def: false
								},
								extra_insurance: {
									type: 'object',
									properties: {
										price: {
											type: 'number',
											optional: true
										}
									}
								}
							}
						}
					},
					referenceId: { type: 'string', optional: true, rules: 'trim' },
					cod: { type: 'numeric', optional: true },
					sendEmail: {
						type: ['boolean', 'string'], optional: false, def: false,
						exec: function(_, value){
							return (value == 'true' || value == '1');
						}
					},
					sendSMS: {
						type: ['boolean', 'string'], optional: false, def: false,
						exec: function(_, value){
							return (value == 'true' || value == '1');
						}
					}
				}
			},
			recalculatePrice: {type: 'Boolean', optional: false},
			reorderRoute: {type: 'Boolean', optional: false}
		}
	};
};
function validateLocation(schema, value){
	if (typeof value !== 'undefined') {
		if(typeof value.warehouse!=='undefined'){
			if(value.warehouse <= 0){
				this.report('must be a valid warehouse');
			}
		}else if(typeof value.address!=='undefined' && value.address!=null){
			var address={};
			address.address=value.address.trim();
			if(address.address.length==0){
				this.report('must be a valid address');
			}else if(typeof value.lat!=='undefined' && typeof value.lng !== 'undefined'){
				address.lat=parseFloat(value.lat);
				if(typeof value.lng!=='undefined'){
					address.lng=parseFloat(value.lng);
					if(address.lat < -90 || address.lat>90){
						this.report('must be a valid latitude between -90 to 90');
					}else if(address.lng < -180 || address.lng>180){
						this.report('must be a valid longitude between -180 to 180');
					}
				}else{
					this.report('must be a valid longitude');
					return;
				}
			}
		}
		else{
			this.report('You must define an address');
		}
	}
	else{
		this.report('You must define a location');
	}
}
