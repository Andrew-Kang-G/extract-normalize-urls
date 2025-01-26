# Url-knife [![NPM version](https://img.shields.io/npm/v/url-knife.svg)](https://www.npmjs.com/package/url-knife) [![](https://data.jsdelivr.com/v1/package/gh/patternknife/url-knife/badge)](https://www.jsdelivr.com/package/gh/patternknife/url-knife) [![](https://badgen.net/bundlephobia/minzip/url-knife)](https://bundlephobia.com/result?p=url-knife)
## Overview
Extract and decompose (fuzzy) URLs (including emails, which are conceptually a part of URLs) in texts with robust patterns.

- This library is currently being refactored into TypeScript, as it was originally developed in JavaScript. 

#### URL knife
<a href="https://jsfiddle.net/AndrewKang/xtfjn8g3/" target="_blank">LIVE DEMO</a>


## Installation

For ES5 users,

``` html
<html>
       <body>
       	<script src="../dist/url-knife.bundle.js"></script>
        <--! OR !-->
       	<script src="https://cdn.jsdelivr.net/gh/patternknife/url-knife@4.1.5/dist/url-knife.bundle.min.js"></script>
       	
       	<script type="text/javascript">
       	</script>
       </body>
</html>
```

For ES6 npm users, run 'npm install --save url-knife' on console.
(**Requred Node v18.20.4**)

``` html
import {TextArea, UrlArea, XmlArea} from 'url-knife';
```

## Syntax & Usage
[Chapter 1. Normalize or parse one URL](#chapter-1-normalize-or-parse-one-url)

[Chapter 2. Extract all URLs or emails](#chapter-2-extract-all-urls-or-emails)

[Chapter 3. Extract URIs with certain names](#chapter-3-extract-uris-with-certain-names)

[Chapter 4. Extract all URLs in raw HTML or XML](#chapter-4-extract-all-urls-in-raw-html-or-xml)


#### Chapter 1. Normalize or parse one URL
The following two methods should be used for processing a single URL, not for multiple URLs within a text.
(For handling multiple URLs, refer to Chapters 2 and 4.)

##### normalizeUrl vs parseUrl
If you need to parse a standard URL without any typos, it is safe to use ``parseUrl``. However, ``normalizeUrl`` is designed to handle URLs that may contain human errors.

* ##### Run ``normalizeUrl``
  
``` javascript
/**
* @brief
* Normalize an url with potential human errors (Intranet urls are not allowed.)
*/
var sample1 = Pattern.UrlArea.normalizeUrl("htp/:/abcgermany.,def;:9094 #park//noon??abc=retry")
var sample2 = Pattern.UrlArea.normalizeUrl("'://abc.jppp:9091 /park/noon'")
var sample3 = Pattern.UrlArea.normalizeUrl("ss hd : /university,.acd. ;jpkp: 9091/adc??abc=.com")

 ```
* ##### Results
 ``` javascript
{
  "url": "htp/:/abcgermany.,def;:9094 #park//noon??abc=retry",
  "normalizedUrl": "http://abcgermany.de:9094#park/noon?abc=retry",
  "removedTailOnUrl": "",
  "protocol": "http",
  "onlyDomain": "abcgermany.de",
  "onlyParams": "?abc=retry",
  "onlyUri": "#park/noon",
  "onlyUriWithParams": "#park/noon?abc=retry",
  "onlyParamsJsn": {
    "abc": "retry"
  },
  "type": "domain",
  "port": "9094"
}
{
  "url": "'://abc.jppp:9091 /park/noon'",
  "normalizedUrl": "abc.jp:9091/park/noon",
  "removedTailOnUrl": "'",
  "protocol": null,
  "onlyDomain": "abc.jp",
  "onlyParams": null,
  "onlyUri": "/park/noon'",
  "onlyUriWithParams": "/park/noon'",
  "onlyParamsJsn": null,
  "type": "domain",
  "port": "9091"
}
{
  "url": "ss hd : /university,.acd. ;jpkp로 접속",
  "normalizedUrl": "ssh://university.ac.jp",
  "removedTailOnUrl": "",
  "protocol": "ssh",
  "onlyDomain": "university.ac.jp",
  "onlyParams": null,
  "onlyUri": null,
  "onlyUriWithParams": null,
  "onlyParamsJsn": null,
  "type": "domain",
  "port": null
}
 ``` 

* ##### Run ``parseUrl``

``` javascript
/**
* @brief
* Parse an url with no potential human errors
*/
var url = Pattern.UrlArea.parseUrl("xtp://gooppalgo.com/park/tree/?abc=1")
 ```
 ###### console.log() 
 ``` javascript
 {
  "url": "xtp://gooppalgo.com/park/tree/?abc=1",
  "removedTailOnUrl": "",
  "protocol": "xtp (unknown protocol)",
  "onlyDomain": "gooppalgo.com",
  "onlyParams": "?abc=1",
  "onlyUri": "/park/tree/",
  "onlyUriWithParams": "/park/tree/?abc=1",
  "onlyParamsJsn": {
    "abc": "1"
  },
  "type": "domain",
  "port": null
}
 ```
 
 #### Chapter 2. Extract all URLs or emails
 
 ##### The following methods are recommended to use in most cases.
 
* ##### extractAllUrls
 
 ``` javascript
     var textStr = 'http://[::1]:8000에서 http ://www.example.com/wpstyle/?p=364 is ok \n' +
         'HTTP://foo.com/blah_blah_(wikipedia) https://www.google.com/maps/place/USA/@36.2218457,... tnae1ver.com:8000on the internet  Asterisk\n ' +
         'the packed1book.net. fakeshouldnotbedetected.url?abc=fake s5houl７十七日dbedetected.jp?japan=go&html=<span>가나다@pacbook.net</span>; abc.com/ad/fg/?kk=5 abc@daum.net' +
         'Have you visited http://goasidaio.ac.kr?abd=5안녕하세요?5...,.&kkk=5rk.,, ' +
         'http://✪df.ws/123\n' +
         'http://142.42.1.1:8080/\n' +
         'http://-.~_!$&\'()*+,;=:%40:80%2f::::::@example.com ' +
         'Have <b>you</b> visited goasidaio.ac.kr?abd=5hell0?5...&kkk=5rk.,. ';
  
      /**
       * @brief
       * Distill all urls from normal text
       * @author Andrew Kang
       * @param textStr string required
       * @param noProtocolJsn object
       *    default :  {
                  'ipV4' : false,
                  'ipV6' : false,
                  'localhost' : false,
                  'intranet' : false
              }
        
  var urls = Pattern.TextArea.extractAllUrls(textStr, {
                     'ipV4' : true,
                     'ipV6' : false,
                     'localhost' : false,
                     'intranet' : true
 })
```

* ##### extractAllEmails

```
        /**
         * @brief
         * Distill all emails from normal text
         * @author Andrew Kang
         * @param textStr string required
         * @param prefixSanitizer boolean (default : false)
         * @return array
         */

  var emails = Pattern.TextArea.extractAllEmails(textStr, true)

  ```
 ###### console.log() 
 ##### You may be wondering what the 'pass' property below means. If 'pass' is true, that is the email pattern is strictly true following RFC rules.
```json
 [{
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
      "removedTailOnEmail": null,
      "type": "domain",
      "removedTailOnUrl": "..."
    },
    "area": "text",
    "index": {
      "start": 242,
      "end": 263
    },
    "pass": true
  }]
```
 <a href="https://jsfiddle.net/AndrewKang/xtfjn8g3/" target="_blank">LIVE DEMO</a>
 
#### Chapter 3. Extract URIs with certain names

``` javascript

var sampleText = 'https://google.com/abc/777?a=5&b=7 abc/def 333/kak abc/55에서 abc/53 abc/533/ka abc/53a/ka /123a/abc/556/dd /abc/123?a=5&b=tkt /xyj/asff' +
        'a333/kak  nice/guy/ bad/or/nice/guy ssh://nice.guy.com/?a=dkdfl';
 
    /**
     * @brief
     * Distill uris with certain names from normal text
     * @author Andrew Kang
     * @param textStr string required
     * @param uris array required
     * for example, [['a','b'], ['c','d']]
     * If you use {number}, this means 'only number' ex) [['a','{number}'], ['c','d']]
     * @param endBoundary boolean (default : false)
     * @return array
     */ 
               
 var uris = Pattern.TextArea.extractCertainUris(sampleText,
  [['{number}', 'kak'], ['nice','guy'],['abc', '{number}']], true)
 
 // 'If endBoundary is set to false, more uris are detected.'
 // This detects all URIs containing '{number}/kak' or nice/guy' or 'abc/{number}'
 ```
 ###### console.log() 
 ``` javascript
[
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
    "inWhatUrl": undefined
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
    "inWhatUrl": null
  }
]
```

#### Chapter 4. Extract all URLs in raw HTML or XML
  
``` javascript
    // The sample of 'XML (HTML)'
var xmlStr =
        'en.wikipedia.org/wiki/Wikipedia:About\n' +
        '<body><p>packed1book.net?user[name][first]=tj&user[name][last]=holowaychuk</p>\n' +
        'fakeshouldnotbedetected.url?abc=fake -s5houl７十七日dbedetected.jp?japan=go- ' +
        'plus.google.co.kr0에서.., \n' +
        'https://plus.google.com/+google\n' +
        'https://www.google.com/maps/place/USA/@36.2218457,...' +
        '<img style=\' = > float : none ; height: 200px;max-width: 50%;margin-top : 3%\' alt="undefined" src="http://www.aaa가가.com/image/showWorkOrderImg?fileName=12345.png"/>\n' +
        '<!--how about adackedbooked.co.kr-the site?  请发邮件给我abc件给@navered.com ssh://www.aaa가.com" <p >--邮件给aa件给@daum.net</p> www.naver.com\n  <p style="width: 100%"></p>-->  "abc@daum.net"로 보내주세요. ' +
        '-gigi.dau.ac.kr?mac=10 -dau.ac.kr?mac=10 <p id="abc" class="def xxx gh" style="<>">abcd@daum.co.kr에서 가나다@pacbook.net<span style="color: rgb(127,127,127);">Please align the paper to the left.</span>&nbsp;</p>\n' +
        '<p> 구루.com <img style="float:none;height: 200px;margin-top : 3%" src="/image/showWorkOrderImg?fileName=123456.png" alt="undefined" abc/></p>\n' +
        'http: //ne1ver.com:8000?abc=1&dd=5 localhost:80 estonia.ee/ estonia.ee? <p class="https://www.aadc给s.cn"> 	https://flaviocopes.com/how-to-inspect-javascript-object/ ※Please ask 203.35.33.555:8000 if you have any issues! ※&nbsp;&nbsp;&nbsp;&nbsp;</p></body> Have you visited goasidaioaaa.ac.kr';
        
var urls = PatternExtractor.XmlArea.extractAllUrls(xmlStr);    
```
###### console.log()
``` javascript
 [
// Not all listed
     {
       "value": {
         "url": "packed1book.net?user[name][first]=tj&user[name][last]=holowaychuk",
         "removedTailOnUrl": "",
         "protocol": null,
         "onlyDomain": "packed1book.net",
         "onlyParams": "?user[name][first]=tj&user[name][last]=holowaychuk",
         "onlyUri": null,
         "onlyUriWithParams": "?user[name][first]=tj&user[name][last]=holowaychuk",
         "onlyParamsJsn": {
           "user": {
             "name": {
               "first": "tj",
               "last": "holowaychuk"
             }
           }
         },
         "type": "domain",
         "port": null
       },
       "area": "text"
   },
   {
     "value": {
       "url": "adackedbooked.co.kr",
       "removedTailOnUrl": "",
       "protocol": null,
       "onlyDomain": "adackedbooked.co.kr",
       "onlyParams": null,
       "onlyUri": null,
       "onlyUriWithParams": null,
       "onlyParamsJsn": null,
       "type": "domain",
       "port": null
     },
     "area": "comment"
   }
    .....
 ]
```
