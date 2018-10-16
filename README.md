# Data-parsers
A library for the integrations to parser different files like *.xml, *.csv, *.xls, *.edi. to create deliveries. 
  
Data-parsers - An agnostic library for the Shippify integrations.
============
This library used templates based on the [JSONPath Syntax](https://github.com/atifaziz/JSONPath) to transform or interpret the data got from the files

####Quick example:
We start with a simple JSON structure built from an XML bill example to generate a delivery JSON:

``` 
{
  "nfeProc": {
    "NFe": {
      "infNFe": {
        "ide": {
          "cUF": {
            "_text": "d35"
          },
          "cNF": {
            "_text": "4694393d8"
          },
          "natOp": {
            "_text": "Rem.Pecas.Man.At.Fixo poder 3o"
          },
          "mod": {
            "_text": "55"
          },
          "serie": {
            "_text": "2"
          },
          "nNF": {
            "_text": "6814998"
          },
          "dhEmi": {
            "_text": "2018-10-04T08:14:49-03:00"
          },
          "tpNF": {
            "_text": "1"
          },
          "idDest": {
            "_text": "1"
          },
          "cMunFG": {
            "_text": "35057068"
          },
          "tpImp": {
            "_text": "1"
          },
          "tpEmis": {
            "_text": "1"
          },
          "cDV": {
            "_text": "7"
          },
          "tpAmb": {
            "_text": "1"
          },
          "finNFe": {
            "_text": "1"
          },
          "indFinal": {
            "_text": "1"
          },
          "indPres": {
            "_text": "9"
          },
          "procEmi": {
            "_text": "0"
          },
          "verProc": {
            "_text": "3.1.1"
          }
        },
        "emit": {
          "CNPJ": {
            "_text": "462667716000756115"
          },
          "xNome": {
            "_text": "EXAMPLE DO BRASIL INDUSTRIA E COMERCIO LTDA"
          },
          "xFant": {
            "_text": "EXAMPLE DO BRASIL INDUSTRIA E COMERCIO LTD"
          },
          "enderEmit": {
            "xLgr": {
              "_text": "AV MARCOS PENTEADO DE ULHOA RODRIGUES"
            },
            "nro": {
              "_text": "4071"
            },
            "xCpl": {
              "_text": "SUBPARTE 21"
            },
            "xBairro": {
              "_text": "TAMBORE"
            },
            "cMun": {
              "_text": "35075708"
            },
            "xMun": {
              "_text": "Barueri"
            },
            "UF": {
              "_text": "SP"
            },
            "CEP": {
              "_text": "06460040"
            },
            "cPais": {
              "_text": "1058"
            },
            "xPais": {
              "_text": "BRASIL"
            },
            "fone": {
              "_text": "1149505070"
            }
          },
          "IE": {
            "_text": "206291277111"
          },
          "IM": {
            "_text": "ISENTO"
          },
          "CNAE": {
            "_text": "4669999"
          },
          "CRT": {
            "_text": "3"
          }
        },
        "dest": {
          "xNome": {
            "_text": "DO ESTADO DE SAO"
          },
          "enderDest": {
            "xLgr": {
              "_text": "R BOA VISTA"
            },
            "nro": {
              "_text": "200"
            },
            "xCpl": {
              "_text": "ANDAR 8"
            },
            "xBairro": {
              "_text": "CENTRO"
            },
            "cMun": {
              "_text": "3550308"
            },
            "xMun": {
              "_text": "Sao Paulo"
            },
            "UF": {
              "_text": "SP"
            },
            "CEP": {
              "_text": "01014001"
            },
            "cPais": {
              "_text": "1058"
            },
            "xPais": {
              "_text": "BRASIL"
            },
            "fone": {
              "_text": "1131059040"
            }
          },
          "indIEDest": {
            "_text": "9"
          },
          "email": {
            "_text": "ria@example.com"
          }
        },
        "det": {
          "_attributes": {
            "nItem": "1"
          },
          "prod": {
            "cProd": {
              "_text": "FL3-7878-000"
            },
            "cEAN": {
              "_text": "SEM GTIN"
            },
            "xProd": {
              "_text": "BASE DE SEPARACAO"
            },
            "NCM": {
              "_text": "39269090"
            },
            "CEST": {
              "_text": "1002000"
            },
            "CFOP": {
              "_text": "5949"
            },
            "uCom": {
              "_text": "PC"
            },
            "qCom": {
              "_text": "1.0000"
            },
            "vUnCom": {
              "_text": "28.890000"
            },
            "vProd": {
              "_text": "28.89"
            },
            "cEANTrib": {
              "_text": "SEM GTIN"
            },
            "uTrib": {
              "_text": "PC"
            },
            "qTrib": {
              "_text": "1.0000"
            },
            "vUnTrib": {
              "_text": "28.890000"
            },
            "indTot": {
              "_text": "1"
            }
          },
          "imposto": {
            "vTotTrib": {
              "_text": "4.33"
            },
            "ICMS": {
              "ICMS40": {
                "orig": {
                  "_text": "6"
                },
                "CST": {
                  "_text": "41"
                }
              }
            },
            "IPI": {
              "cEnq": {
                "_text": "999"
              },
              "IPITrib": {
                "CST": {
                  "_text": "50"
                },
                "vBC": {
                  "_text": "28.89"
                },
                "pIPI": {
                  "_text": "15.00"
                },
                "vIPI": {
                  "_text": "4.33"
                }
              }
            },
            "PIS": {
              "PISOutr": {
                "CST": {
                  "_text": "49"
                },
                "vBC": {
                  "_text": "0.00"
                },
                "pPIS": {
                  "_text": "0.00"
                },
                "vPIS": {
                  "_text": "0.00"
                }
              }
            },
            "COFINS": {
              "COFINSOutr": {
                "CST": {
                  "_text": "49"
                },
                "vBC": {
                  "_text": "0.00"
                },
                "pCOFINS": {
                  "_text": "0.00"
                },
                "vCOFINS": {
                  "_text": "0.00"
                }
              }
            }
          }
        },
        "transp": {
          "modFrete": {
            "_text": "0"
          },
          "transporta": {
            "CNPJ": {
              "_text": "06927621000100"
            },
            "xNome": {
              "_text": "SHIPPIFY SA"
            },
            "xEnder": {
              "_text": "AV LUIS ARROBAS MARTINS,01  04781000 CAPELA DO SOCORR"
            },
            "xMun": {
              "_text": "Sao Paulo"
            },
            "UF": {
              "_text": "SP"
            }
          },
          "vol": {
            "qVol": {
              "_text": "1"
            },
            "esp": {
              "_text": "VOL"
            },
            "pesoL": {
              "_text": "0.000"
            },
            "pesoB": {
              "_text": "1.000"
            }
          }
        },
        "infAdic": {
          "infCpl": {
            "_text": "AV SAMPAIO VIDAL, 132 - CENTRO - MARILIA-SP - CEP 17500-020 - SUSANE ANGEL"
          }
        }
      }
    },
    "protNFe": {
      "_attributes": {
        "versao": "5.00"
      },
      "infProt": {
        "tpAmb": {
          "_text": "1"
        },
        "verAplic": {
          "_text": "SP_NFE_PL009_V44"
        },
        "chNFe": {
          "_text": "351810462667710007115500200066819981469439387"
        },
        "dhRecbto": {
          "_text": "2018-10-04T08:17:05-03:00"
        },
        "nProt": {
          "_text": "1351806793196485"
        },
        "digVal": {
          "_text": "35lsqCPaOTHpJxgcplcMp4s9aSg="
        },
        "cStat": {
          "_text": "1002"
        },
        "xMotivo": {
          "_text": "Autorizado o uso da NF-e"
        }
      }
    }
  }
}

```
- ####Template Used
```json
{
    "template": {
        "deliveries": [
            {
                "referenceId": "{{$.nfeProc.NFe.infNFe.ide.cNF._text}}",
                "pickup": {
                    "contact": {
                        "name" : "{{$.nfeProc.NFe.infNFe.transp.transporta.xNome._text}}",
                        "phone" : "5400000000",
                        "email" : "example@shippify.co"
                    },
                    "location": {
                        "address": 	"{{$.nfeProc.NFe.infNFe.transp.transporta.xEnder._text}}, {{$.nfeProc.NFe.infNFe.transp.transporta.xMun._text}}, {{$.nfeProc.NFe.infNFe.transp.transporta.UF._text}}"
                    }
                },
                "dropoff":  {
    				"contact": {
                        
    					"name": "{{$.nfeProc.NFe.infNFe.dest.xNome._text}}",
    					"phone": "{{$.nfeProc.NFe.infNFe.dest.enderDest.fone._text}}",
    					"email": "{{$.nfeProc.NFe.infNFe.dest.email}}"
    				},
    				"location": {
    					"address": "{{$.nfeProc.NFe.infNFe.dest.enderDest.xLgr._text}}, {{$.nfeProc.NFe.infNFe.dest.enderDest.nro._text}} {{$.nfeProc.NFe.infNFe.dest.enderDest.xCpl._text}}, {{$.nfeProc.NFe.infNFe.dest.enderDest.xBairro._text}}, {{$.nfeProc.NFe.infNFe.dest.enderDest.cMun._text}}, {{$.nfeProc.NFe.infNFe.dest.enderDest.xMun._text}}, {{$.nfeProc.NFe.infNFe.dest.enderDest.UF._text}}, CEP {{$.nfeProc.NFe.infNFe.dest.enderDest.CEP._text}} ", 
    					"instructions": "{{$.nfeProc.NFe.infNFe.infAdic.infCpl._text}}"
    				}
                },
                "packages": [
                    {
                        "id" : "{{$.nfeProc.NFe.infNFe.det.prod.cProd._text}}",
                        "name" : "{{$.nfeProc.NFe.infNFe.det.prod.xProd._text}}",
                        "size" : 3,
                        "qty" : "{?=default:1{$.nfeProc.NFe.infNFe.det.prod.qCom._text}}"
                    }
                ]
            }
        ]
    }
}

```

####Result:
```
{
  "deliveries": [
    {
      "referenceId": "46943938",
      "pickup": {
        "contact": {
          "name": "EXAMPLE DO BRASIL INDUSTRIA E COMERCIO LTDA",
          "phone": "5400000000",
          "email": "example@shippify.co"
        },
        "location": {
          "address": "AV LUIS ARROBAS MARTINS,01  04781000 CAPELA DO SOCORR, Sao Paulo, SP"
        }
      },
      "dropoff": {
        "contact": {
          "name": "DO ESTADO DE SAO PAULO",
          "phone": "1131053490408",
          "email": {
            "_text": "ria@example.com"
          }
        },
        "location": {
          "address": "R BOA VISTA, 200 ANDAR 8, CENTRO, 3550308, Sao Paulo, SP, CEP 01014001 ",
          "instructions": "AV SAMPAIO VIDAL, 132 - CENTRO - MARILIA-SP - CEP 17500-020 - SUSANE ANGEL"
        }
      },
      "packages": [
        {
          "id": "FL3-7878-000",
          "name": "BASE DE SEPARACAO",
          "size": 3,
          "qty": "1.0000"
        }
      ]
    }
  ]
}
```

