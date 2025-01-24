import Pattern from "../src/entry";
const assert = require('assert');
/*function test(title, testCode) {
    try {
        testCode();
    } catch (error) {
        console.error(error);
    }
}*/

function expect(result) {
    return {
        toBe: function(expected) {
            if (result !== expected) {
                throw new Error(result + ' is not equal to ' + expected);
            }
        }
    }
}

/*test('', function() {
    expect(UrlArea.normalizeUrl("htp/:/abcgermany.,def;:9094 #park//noon??abc=retry")["normalizedUrl"])
        .toBe("http://abcgermany.de:9094#park/noon?abc=retry")
    ;

});*/

describe('BDD style', function() {
    before(function() {
        // excuted before test suite
    });

    after(function() {
        // excuted after test suite
    });


    describe('UrlArea', function() {
        it('normalizeUrl', function() {
            expect(Pattern.UrlArea.normalizeUrl("htp/:/abcgermany.,def;:9094 #park//noon??abc=retry").normalizedUrl)
                .toBe("http://abcgermany.de:9094#park/noon?abc=retry");
        });
        it('parseUrl', function() {
            expect(Pattern.UrlArea.parseUrl("xtp://gooppalgo.com/park/tree/?abc=1").onlyUriWithParams)
                .toBe("/park/tree/?abc=1");
        });
    });

    describe('TextArea', function() {

        const textStr = 'http://[::1]:8000에서 http ://www.example.com/wpstyle/?p=364 is ok \n' +
            'HTTP://foo.com/blah_blah_(wikipedia) https://www.google.com/maps/place/USA/@36.2218457,... tnae1ver.com:8000on the internet  Asterisk\n ' +
            'the packed1book.net. 가나다@apacbook.ac.kr? adssd@asdasd.ac.jp... fakeshouldnotbedetected.url?abc=fake s5houl７十七日dbedetected.jp?japan=go&html=<span>가나다@pacbook.travelersinsurance</span>; abc.com/ad/fg/?kk=5 abc@daum.net' +
            'Have you visited http://goasidaio.ac.kr?abd=5안녕하세요?5...,.&kkk=5rk.,, ' +
            'http://✪df.ws/123\n' +
            'http://142.42.1.1:8080/\n' +
            'http://-.~_!$&\'()*+,;=:%40:80%2f::::::a@example.com 가abc@pacbook.net ' +
            'Have <b>you</b> visited goasidaio.ac.kr?abd=5hell0?5...&kkk=5rk.,. abc.def 1353aa.liars다';;


        it('extractAllUrls', function() {
            assert.deepEqual(Pattern.TextArea.extractAllUrls(textStr), [
                {
                    "value": {
                        "url": "http://[::1]:8000",
                        "removedTailOnUrl": "",
                        "protocol": "http",
                        "onlyDomain": "[::1]",
                        "onlyParams": null,
                        "onlyUri": null,
                        "onlyUriWithParams": null,
                        "onlyParamsJsn": null,
                        "type": "ip_v6",
                        "port": "8000"
                    },
                    "area": "text",
                    "index": {
                        "start": 0,
                        "end": 17
                    }
                },
                {
                    "value": {
                        "url": "http://www.example.com/wpstyle/?p=364",
                        "removedTailOnUrl": "",
                        "protocol": "http",
                        "onlyDomain": "www.example.com",
                        "onlyParams": "?p=364",
                        "onlyUri": "/wpstyle/",
                        "onlyUriWithParams": "/wpstyle/?p=364",
                        "onlyParamsJsn": {
                            "p": "364"
                        },
                        "type": "domain",
                        "port": null
                    },
                    "area": "text",
                    "index": {
                        "start": 20,
                        "end": 58
                    }
                },
                {
                    "value": {
                        "url": "HTTP://foo.com/blah_blah_(wikipedia)",
                        "removedTailOnUrl": "",
                        "protocol": "HTTP",
                        "onlyDomain": "foo.com",
                        "onlyParams": null,
                        "onlyUri": "/blah_blah_(wikipedia)",
                        "onlyUriWithParams": "/blah_blah_(wikipedia)",
                        "onlyParamsJsn": null,
                        "type": "domain",
                        "port": null
                    },
                    "area": "text",
                    "index": {
                        "start": 66,
                        "end": 102
                    }
                },
                {
                    "value": {
                        "url": "https://www.google.com/maps/place/USA/@36.2218457,...",
                        "removedTailOnUrl": "",
                        "protocol": "https",
                        "onlyDomain": "www.google.com",
                        "onlyParams": null,
                        "onlyUri": "/maps/place/USA/@36.2218457,...",
                        "onlyUriWithParams": "/maps/place/USA/@36.2218457,...",
                        "onlyParamsJsn": null,
                        "type": "domain",
                        "port": null
                    },
                    "area": "text",
                    "index": {
                        "start": 103,
                        "end": 156
                    }
                },
                {
                    "value": {
                        "url": "tnae1ver.com:8000",
                        "removedTailOnUrl": "",
                        "protocol": null,
                        "onlyDomain": "tnae1ver.com",
                        "onlyParams": null,
                        "onlyUri": null,
                        "onlyUriWithParams": null,
                        "onlyParamsJsn": null,
                        "type": "domain",
                        "port": "8000"
                    },
                    "area": "text",
                    "index": {
                        "start": 157,
                        "end": 174
                    }
                },
                {
                    "value": {
                        "url": "packed1book.net",
                        "removedTailOnUrl": ".",
                        "protocol": null,
                        "onlyDomain": "packed1book.net.",
                        "onlyParams": null,
                        "onlyUri": null,
                        "onlyUriWithParams": null,
                        "onlyParamsJsn": null,
                        "type": "domain",
                        "port": null
                    },
                    "area": "text",
                    "index": {
                        "start": 205,
                        "end": 220
                    }
                },
                {
                    "value": {
                        "url": "s5houl７十七日dbedetected.jp?japan=go&html=<span>가나다@pacbook.travelersinsurance</span>;",
                        "removedTailOnUrl": "",
                        "protocol": null,
                        "onlyDomain": "s5houl７十七日dbedetected.jp",
                        "onlyParams": "?japan=go&html=<span>가나다@pacbook.travelersinsurance</span>;",
                        "onlyUri": null,
                        "onlyUriWithParams": "?japan=go&html=<span>가나다@pacbook.travelersinsurance</span>;",
                        "onlyParamsJsn": {
                            "japan": "go",
                            "html": "<span>가나다@pacbook.travelersinsurance</span>;"
                        },
                        "type": "domain",
                        "port": null
                    },
                    "area": "text",
                    "index": {
                        "start": 301,
                        "end": 384
                    }
                },
                {
                    "value": {
                        "url": "abc.com/ad/fg/?kk=5",
                        "removedTailOnUrl": "",
                        "protocol": null,
                        "onlyDomain": "abc.com",
                        "onlyParams": "?kk=5",
                        "onlyUri": "/ad/fg/",
                        "onlyUriWithParams": "/ad/fg/?kk=5",
                        "onlyParamsJsn": {
                            "kk": "5"
                        },
                        "type": "domain",
                        "port": null
                    },
                    "area": "text",
                    "index": {
                        "start": 385,
                        "end": 404
                    }
                },
                {
                    "value": {
                        "url": "http://goasidaio.ac.kr?abd=5안녕하세요?5...,.&kkk=5rk",
                        "removedTailOnUrl": ".,,",
                        "protocol": "http",
                        "onlyDomain": "goasidaio.ac.kr",
                        "onlyParams": "?abd=5안녕하세요?5...,.&kkk=5rk.,,",
                        "onlyUri": null,
                        "onlyUriWithParams": "?abd=5안녕하세요?5...,.&kkk=5rk.,,",
                        "onlyParamsJsn": {
                            "abd": "5안녕하세요?5...,.",
                            "kkk": "5rk.,,"
                        },
                        "type": "domain",
                        "port": null
                    },
                    "area": "text",
                    "index": {
                        "start": 434,
                        "end": 482
                    }
                },
                {
                    "value": {
                        "url": "http://✪df.ws/123",
                        "removedTailOnUrl": "",
                        "protocol": "http",
                        "onlyDomain": "✪df.ws",
                        "onlyParams": null,
                        "onlyUri": "/123",
                        "onlyUriWithParams": "/123",
                        "onlyParamsJsn": null,
                        "type": "domain",
                        "port": null
                    },
                    "area": "text",
                    "index": {
                        "start": 486,
                        "end": 503
                    }
                },
                {
                    "value": {
                        "url": "http://142.42.1.1:8080",
                        "removedTailOnUrl": "/",
                        "protocol": "http",
                        "onlyDomain": "142.42.1.1",
                        "onlyParams": null,
                        "onlyUri": null,
                        "onlyUriWithParams": null,
                        "onlyParamsJsn": null,
                        "type": "ip_v4",
                        "port": "8080"
                    },
                    "area": "text",
                    "index": {
                        "start": 504,
                        "end": 526
                    }
                },
                {
                    "value": {
                        "url": "http://-.~_!$&'()*+,;=:%40:80%2f::::::a@example.com",
                        "removedTailOnUrl": "",
                        "protocol": "http",
                        "onlyDomain": "-.~_!$&'()*+,;=:%40:80%2f::::::a@example.com",
                        "onlyParams": null,
                        "onlyUri": null,
                        "onlyUriWithParams": null,
                        "onlyParamsJsn": null,
                        "type": "domain",
                        "port": null
                    },
                    "area": "text",
                    "index": {
                        "start": 528,
                        "end": 579
                    }
                },
                {
                    "value": {
                        "url": "goasidaio.ac.kr?abd=5hell0?5...&kkk=5rk",
                        "removedTailOnUrl": ".,.",
                        "protocol": null,
                        "onlyDomain": "goasidaio.ac.kr",
                        "onlyParams": "?abd=5hell0?5...&kkk=5rk.,.",
                        "onlyUri": null,
                        "onlyUriWithParams": "?abd=5hell0?5...&kkk=5rk.,.",
                        "onlyParamsJsn": {
                            "abd": "5hell0?5...",
                            "kkk": "5rk.,."
                        },
                        "type": "domain",
                        "port": null
                    },
                    "area": "text",
                    "index": {
                        "start": 621,
                        "end": 660
                    }
                }
            ])
        });

        it('extractAllUrlsWithIntranets', function() {
            assert.deepEqual(Pattern.TextArea.extractAllUrls(textStr, {ip_v4 : false, ip_v6 :false, localhost : false,  intranet : true}), [
                {
                    "value": {
                        "url": "http://[::1]:8000",
                        "removedTailOnUrl": "",
                        "protocol": "http",
                        "onlyDomain": "[::1]",
                        "onlyParams": null,
                        "onlyUri": null,
                        "onlyUriWithParams": null,
                        "onlyParamsJsn": null,
                        "type": "ip_v6",
                        "port": "8000"
                    },
                    "area": "text",
                    "index": {
                        "start": 0,
                        "end": 17
                    }
                },
                {
                    "value": {
                        "url": "http://www.example.com/wpstyle/?p=364",
                        "removedTailOnUrl": "",
                        "protocol": "http",
                        "onlyDomain": "www.example.com",
                        "onlyParams": "?p=364",
                        "onlyUri": "/wpstyle/",
                        "onlyUriWithParams": "/wpstyle/?p=364",
                        "onlyParamsJsn": {
                            "p": "364"
                        },
                        "type": "domain",
                        "port": null
                    },
                    "area": "text",
                    "index": {
                        "start": 20,
                        "end": 58
                    }
                },
                {
                    "value": {
                        "url": "HTTP://foo.com/blah_blah_(wikipedia)",
                        "removedTailOnUrl": "",
                        "protocol": "HTTP",
                        "onlyDomain": "foo.com",
                        "onlyParams": null,
                        "onlyUri": "/blah_blah_(wikipedia)",
                        "onlyUriWithParams": "/blah_blah_(wikipedia)",
                        "onlyParamsJsn": null,
                        "type": "domain",
                        "port": null
                    },
                    "area": "text",
                    "index": {
                        "start": 66,
                        "end": 102
                    }
                },
                {
                    "value": {
                        "url": "https://www.google.com/maps/place/USA/@36.2218457,...",
                        "removedTailOnUrl": "",
                        "protocol": "https",
                        "onlyDomain": "www.google.com",
                        "onlyParams": null,
                        "onlyUri": "/maps/place/USA/@36.2218457,...",
                        "onlyUriWithParams": "/maps/place/USA/@36.2218457,...",
                        "onlyParamsJsn": null,
                        "type": "domain",
                        "port": null
                    },
                    "area": "text",
                    "index": {
                        "start": 103,
                        "end": 156
                    }
                },
                {
                    "value": {
                        "url": "tnae1ver.com:8000",
                        "removedTailOnUrl": "",
                        "protocol": null,
                        "onlyDomain": "tnae1ver.com",
                        "onlyParams": null,
                        "onlyUri": null,
                        "onlyUriWithParams": null,
                        "onlyParamsJsn": null,
                        "type": "domain",
                        "port": "8000"
                    },
                    "area": "text",
                    "index": {
                        "start": 157,
                        "end": 174
                    }
                },
                {
                    "value": {
                        "url": "packed1book.net",
                        "removedTailOnUrl": ".",
                        "protocol": null,
                        "onlyDomain": "packed1book.net.",
                        "onlyParams": null,
                        "onlyUri": null,
                        "onlyUriWithParams": null,
                        "onlyParamsJsn": null,
                        "type": "domain",
                        "port": null
                    },
                    "area": "text",
                    "index": {
                        "start": 205,
                        "end": 220
                    }
                },
                {
                    "value": {
                        "url": "fakeshouldnotbedetected.url?abc=fake",
                        "removedTailOnUrl": "",
                        "protocol": null,
                        "onlyDomain": "fakeshouldnotbedetected.url",
                        "onlyParams": "?abc=fake",
                        "onlyUri": null,
                        "onlyUriWithParams": "?abc=fake",
                        "onlyParamsJsn": {
                            "abc": "fake"
                        },
                        "type": "domain",
                        "port": null
                    },
                    "area": "text",
                    "index": {
                        "start": 264,
                        "end": 300
                    }
                },
                {
                    "value": {
                        "url": "s5houl７十七日dbedetected.jp?japan=go&html=<span>가나다@pacbook.travelersinsurance</span>;",
                        "removedTailOnUrl": "",
                        "protocol": null,
                        "onlyDomain": "s5houl７十七日dbedetected.jp",
                        "onlyParams": "?japan=go&html=<span>가나다@pacbook.travelersinsurance</span>;",
                        "onlyUri": null,
                        "onlyUriWithParams": "?japan=go&html=<span>가나다@pacbook.travelersinsurance</span>;",
                        "onlyParamsJsn": {
                            "html": "<span>가나다@pacbook.travelersinsurance</span>;",
                            "japan": "go"
                        },
                        "type": "domain",
                        "port": null
                    },
                    "area": "text",
                    "index": {
                        "start": 301,
                        "end": 384
                    }
                },
                {
                    "value": {
                        "url": "abc.com/ad/fg/?kk=5",
                        "removedTailOnUrl": "",
                        "protocol": null,
                        "onlyDomain": "abc.com",
                        "onlyParams": "?kk=5",
                        "onlyUri": "/ad/fg/",
                        "onlyUriWithParams": "/ad/fg/?kk=5",
                        "onlyParamsJsn": {
                            "kk": "5"
                        },
                        "type": "domain",
                        "port": null
                    },
                    "area": "text",
                    "index": {
                        "start": 385,
                        "end": 404
                    }
                },
                {
                    "value": {
                        "url": "http://goasidaio.ac.kr?abd=5안녕하세요?5...,.&kkk=5rk",
                        "removedTailOnUrl": ".,,",
                        "protocol": "http",
                        "onlyDomain": "goasidaio.ac.kr",
                        "onlyParams": "?abd=5안녕하세요?5...,.&kkk=5rk.,,",
                        "onlyUri": null,
                        "onlyUriWithParams": "?abd=5안녕하세요?5...,.&kkk=5rk.,,",
                        "onlyParamsJsn": {
                            "abd": "5안녕하세요?5...,.",
                            "kkk": "5rk.,,"
                        },
                        "type": "domain",
                        "port": null
                    },
                    "area": "text",
                    "index": {
                        "start": 434,
                        "end": 482
                    }
                },
                {
                    "value": {
                        "url": "http://✪df.ws/123",
                        "removedTailOnUrl": "",
                        "protocol": "http",
                        "onlyDomain": "✪df.ws",
                        "onlyParams": null,
                        "onlyUri": "/123",
                        "onlyUriWithParams": "/123",
                        "onlyParamsJsn": null,
                        "type": "domain",
                        "port": null
                    },
                    "area": "text",
                    "index": {
                        "start": 486,
                        "end": 503
                    }
                },
                {
                    "value": {
                        "url": "http://142.42.1.1:8080",
                        "removedTailOnUrl": "/",
                        "protocol": "http",
                        "onlyDomain": "142.42.1.1",
                        "onlyParams": null,
                        "onlyUri": null,
                        "onlyUriWithParams": null,
                        "onlyParamsJsn": null,
                        "type": "ip_v4",
                        "port": "8080"
                    },
                    "area": "text",
                    "index": {
                        "start": 504,
                        "end": 526
                    }
                },
                {
                    "value": {
                        "url": "http://-.~_!$&'()*+,;=:%40:80%2f::::::a@example.com",
                        "removedTailOnUrl": "",
                        "protocol": "http",
                        "onlyDomain": "-.~_!$&'()*+,;=:%40:80%2f::::::a@example.com",
                        "onlyParams": null,
                        "onlyUri": null,
                        "onlyUriWithParams": null,
                        "onlyParamsJsn": null,
                        "type": "domain",
                        "port": null
                    },
                    "area": "text",
                    "index": {
                        "start": 528,
                        "end": 579
                    }
                },
                {
                    "value": {
                        "url": "goasidaio.ac.kr?abd=5hell0?5...&kkk=5rk",
                        "removedTailOnUrl": ".,.",
                        "protocol": null,
                        "onlyDomain": "goasidaio.ac.kr",
                        "onlyParams": "?abd=5hell0?5...&kkk=5rk.,.",
                        "onlyUri": null,
                        "onlyUriWithParams": "?abd=5hell0?5...&kkk=5rk.,.",
                        "onlyParamsJsn": {
                            "abd": "5hell0?5...",
                            "kkk": "5rk.,."
                        },
                        "type": "domain",
                        "port": null
                    },
                    "area": "text",
                    "index": {
                        "start": 621,
                        "end": 660
                    }
                },
                {
                    "value": {
                        "url": "abc.def",
                        "removedTailOnUrl": "",
                        "protocol": null,
                        "onlyDomain": "abc.def",
                        "onlyParams": null,
                        "onlyUri": null,
                        "onlyUriWithParams": null,
                        "onlyParamsJsn": null,
                        "type": "domain",
                        "port": null
                    },
                    "area": "text",
                    "index": {
                        "start": 664,
                        "end": 671
                    }
                },
                {
                    "value": {
                        "url": "1353aa.liars",
                        "removedTailOnUrl": "다",
                        "protocol": null,
                        "onlyDomain": "1353aa.liars다",
                        "onlyParams": null,
                        "onlyUri": null,
                        "onlyUriWithParams": null,
                        "onlyParamsJsn": null,
                        "type": "domain",
                        "port": null
                    },
                    "area": "text",
                    "index": {
                        "start": 672,
                        "end": 684
                    }
                }
            ])
        });

       it('extractAllEmails', function() {
            assert.deepEqual(Pattern.TextArea.extractAllEmails(textStr, true), [
                {
                    "value": {
                        "email": "가나다@apacbook.ac.kr",
                        "removedTailOnEmail": null,
                        "type": "domain"
                    },
                    "area": "text",
                    "index": {
                        "start": 222,
                        "end": 240
                    },
                    "pass": false
                },
                {
                    "value": {
                        "email": "adssd@asdasd.ac.jp",
                        "removedTailOnEmail": "...",
                        "type": "domain",
                    },
                    "area": "text",
                    "index": {
                        "start": 242,
                        "end": 260
                    },
                    "pass": true
                },
                {
                    "value": {
                        "email": "가나다@pacbook.travelersinsurance",
                        "removedTailOnEmail": null,
                        "type": "domain"
                    },
                    "area": "text",
                    "index": {
                        "start": 346,
                        "end": 376
                    },
                    "pass": false
                },
                {
                    "value": {
                        "email": "a@example.com",
                        "removedTailOnEmail": null,
                        "type": "domain"
                    },
                    "area": "text",
                    "index": {
                        "start": 566,
                        "end": 579
                    },
                    "pass": true
                },
                {
                    "value": {
                        "email": "abc@pacbook.net",
                        "removedTailOnEmail": null,
                        "type": "domain"
                    },
                    "area": "text",
                    "index": {
                        "start": 581,
                        "end": 596
                    },
                    "pass": true
                }
            ])
        })


    });
});