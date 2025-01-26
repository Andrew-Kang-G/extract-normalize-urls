import {TextAreaApi, UrlAreaApi} from "../src/entry";

const assert = require('assert');


function expect(result: string | null) {
    return {
        toBe: function(expected: string | null) {
            if (result !== expected) {
                throw new Error(result + ' is not equal to ' + expected);
            }
        }
    }
}

describe('BDD style (URL,EMAIL)', function() {
    before(function() {
        // excuted before test suite
    });

    after(function() {
        // excuted after test suite
    });

    describe('UrlArea', function() {
        it('normalizeUrl', function() {
            expect(UrlAreaApi.normalizeUrl("htp/:/abcgermany.,def;:9094 #park//noon??abc=retry").normalizedUrl)
                .toBe("http://abcgermany.de:9094#park/noon?abc=retry");
        });
        it('parseUrl', function() {
            expect(UrlAreaApi.parseUrl("xtp://gooppalgo.com/park/tree/?abc=1").onlyUriWithParams)
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
            assert.deepEqual(TextAreaApi.extractAllUrls(textStr), [
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
                        "type": "ipV6",
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
                        "type": "ipV4",
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
            assert.deepEqual(TextAreaApi.extractAllUrls(textStr, {ipV4 : false, ipV6 :false, localhost : false,  intranet : true}), [
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
                        "type": "ipV6",
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
                        "type": "ipV4",
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
            assert.deepEqual(TextAreaApi.extractAllEmails(textStr, true), [
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

describe('BDD style (URI)', function() {
    const sampleText2 = 'https://google.com/abc/777?a=5&b=7 abc/def 333/kak abc/55에서 abc/53 abc/533/ka abc/53a/ka /123a/abc/556/dd /abc/123?a=5&b=tkt /xyj/asff' +
        'a333/kak  nice/guy/ bad/or/nice/guy ssh://nice.guy.com/?a=dkdfl';

    /**
     * @brief
     * Distill URIs with certain names from normal text
     * @author Andrew Kang
     * @param textStr string required
     * @param uris array required
     * for example, [['a','b'], ['c','d']]
     * If you use {number}, this means 'only number' ex) [['a','{number}'], ['c','d']]
     * @param endBoundary boolean (default : false)
     * @return array
     */
    it('extractCertainUris', function() {
        const uris = TextAreaApi.extractCertainUris(
            sampleText2,
            [['{number}', 'kak'], ['nice', 'guy'], ['abc', '{number}']],
            true
        );

        console.log(uris);

        assert.deepEqual(uris, [
            {
                "uriDetected": {
                    "value": {
                        "url": "/abc/777?a=5&b=7",
                        "removedTailOnUrl": "",
                        "protocol": null,
                        "onlyDomain": "",
                        "onlyParams": "?a=5&b=7",
                        "onlyUri": "/abc/777",
                        "onlyUriWithParams": "/abc/777?a=5&b=7",
                        "onlyParamsJsn": {
                            "a": "5",
                            "b": "7"
                        },
                        "type": "domain",
                        "port": null
                    },
                    "area": "text",
                    "index": {
                        "start": 18,
                        "end": 34
                    }
                },
                "inWhatUrl": {
                    "value": {
                        "url": "https://google.com/abc/777?a=5&b=7",
                        "removedTailOnUrl": "",
                        "protocol": "https",
                        "onlyDomain": "google.com",
                        "onlyParams": "?a=5&b=7",
                        "onlyUri": "/abc/777",
                        "onlyUriWithParams": "/abc/777?a=5&b=7",
                        "onlyParamsJsn": {
                            "a": "5",
                            "b": "7"
                        },
                        "type": "domain",
                        "port": null
                    },
                    "area": "text",
                    "index": {
                        "start": 0,
                        "end": 34
                    }
                }
            },
            {
                "uriDetected": {
                    "value": {
                        "url": "333/kak",
                        "removedTailOnUrl": "",
                        "protocol": null,
                        "onlyDomain": null,
                        "onlyParams": null,
                        "onlyUri": "333/kak",
                        "onlyUriWithParams": "333/kak",
                        "onlyParamsJsn": null,
                        "type": "uri",
                        "port": null
                    },
                    "area": "text",
                    "index": {
                        "start": 43,
                        "end": 51
                    }
                },
                "inWhatUrl": undefined
            },
            {
                "uriDetected": {
                    "value": {
                        "url": "abc/53",
                        "removedTailOnUrl": "",
                        "protocol": null,
                        "onlyDomain": null,
                        "onlyParams": null,
                        "onlyUri": "abc/53",
                        "onlyUriWithParams": "abc/53",
                        "onlyParamsJsn": null,
                        "type": "uri",
                        "port": null
                    },
                    "area": "text",
                    "index": {
                        "start": 60,
                        "end": 67
                    }
                },
                "inWhatUrl": undefined
            },
            {
                "uriDetected": {
                    "value": {
                        "url": "abc/533/ka",
                        "removedTailOnUrl": "",
                        "protocol": null,
                        "onlyDomain": null,
                        "onlyParams": null,
                        "onlyUri": "abc/533/ka",
                        "onlyUriWithParams": "abc/533/ka",
                        "onlyParamsJsn": null,
                        "type": "uri",
                        "port": null
                    },
                    "area": "text",
                    "index": {
                        "start": 67,
                        "end": 77
                    }
                },
                "inWhatUrl": undefined
            },
            {
                "uriDetected": {
                    "value": {
                        "url": "/123a/abc/556/dd",
                        "removedTailOnUrl": "",
                        "protocol": null,
                        "onlyDomain": null,
                        "onlyParams": null,
                        "onlyUri": "/123a/abc/556/dd",
                        "onlyUriWithParams": "/123a/abc/556/dd",
                        "onlyParamsJsn": null,
                        "type": "uri",
                        "port": null
                    },
                    "area": "text",
                    "index": {
                        "start": 89,
                        "end": 105
                    }
                },
                "inWhatUrl": null
            },
            {
                "uriDetected": {
                    "value": {
                        "url": "/abc/123?a=5&b=tkt",
                        "removedTailOnUrl": "",
                        "protocol": null,
                        "onlyDomain": null,
                        "onlyParams": "?a=5&b=tkt",
                        "onlyUri": "/abc/123",
                        "onlyUriWithParams": "/abc/123?a=5&b=tkt",
                        "onlyParamsJsn": {
                            "a": "5",
                            "b": "tkt"
                        },
                        "type": "uri",
                        "port": null
                    },
                    "area": "text",
                    "index": {
                        "start": 106,
                        "end": 124
                    }
                },
                "inWhatUrl": undefined
            },
            {
                "uriDetected": {
                    "value": {
                        "url": "nice/guy",
                        "removedTailOnUrl": "/",
                        "protocol": null,
                        "onlyDomain": null,
                        "onlyParams": null,
                        "onlyUri": "nice/guy",
                        "onlyUriWithParams": "nice/guy",
                        "onlyParamsJsn": null,
                        "type": "uri",
                        "port": null
                    },
                    "area": "text",
                    "index": {
                        "start": 144,
                        "end": 153
                    }
                },
                "inWhatUrl": undefined
            },
            {
                "uriDetected": {
                    "value": {
                        "url": "/or/nice/guy",
                        "removedTailOnUrl": "",
                        "protocol": null,
                        "onlyDomain": null,
                        "onlyParams": null,
                        "onlyUri": "/or/nice/guy",
                        "onlyUriWithParams": "/or/nice/guy",
                        "onlyParamsJsn": null,
                        "type": "uri",
                        "port": null
                    },
                    "area": "text",
                    "index": {
                        "start": 157,
                        "end": 170
                    }
                },
                "inWhatUrl": undefined
            }
        ]);
    });
});
