const request = require('request');
const async = require('async');

class PageService {
    constructor(pageConfig) {
        this.pageAssembleConfig = {};
        console.log('this.pageAssembleConfig', this.pageAssembleConfig);
        let instance = this;
        pageConfig.result.page.forEach(function (page) {
            instance.pageAssembleConfig[page.name] = {
                web: page.portalSections,
                mobile: page.appSections
            }
        })
    }
    assemble(req, res) {
        const source = req.body.request.source;
        const name = req.body.request.name;
        const sections = this.pageAssembleConfig[name][source];
        let sectionCalls = [];
        let instance = this;
        sections.forEach(function (section) {
            sectionCalls.push(function (callback) {
                var options = instance.getHttpOptions('http://28.0.3.10:9000/v3/search', section.searchQuery, 'POST', {})
                instance.sendRequest(options, function (error, response, body) {
                    if (error) {
                        callback(error)
                    } else {
                        section.contents = body.result.content;
                        callback(null, section);
                    }
                })
            });
        })
        async.parallel(sectionCalls,
            function (err, results) {
                if (err) {
                    instance.sendError(res, { id: 'api.page.assemble', params: { err: err } });
                } else {
                    instance.sendSuccess(res, { id: 'api.page.assemble', results: results, name: name });
                }
            }
        );
    }
    sendError(res, options) {
        const resObj = {
            id: options.id,
            ver: options.ver || '1.0',
            ets: new Date().getTime(),
            params: options.params || {},
            responseCode: options.responseCode || 'SERVER_ERROR'
        }
        res.status(500);
        res.json(resObj);
    }
    sendSuccess(res, options) {
        const resObj = {
            id: options.id,
            ver: options.ver || '1.0',
            ets: new Date().getTime(),
            params: options.params || {},
            responseCode: options.responseCode || 'SUCCESS',
            result: {
                name: options.name,
                sections: options.results
            }
        }
        res.status(200);
        res.json(resObj);
    }
    sendRequest(options, cb) {
        request(options, function (error, response, body) {
            cb(error, response, body);
        });
    }
    getHttpOptions(url, data, method, headers) {
        var defaultHeaders = { 'Content-Type': 'application/json' }

        var http_options = { url: url, forever: true, headers: defaultHeaders, method: method, json: true }

        if (headers) {
            headers['Content-Type'] = headers['Content-Type'] ? headers['Content-Type'] : defaultHeaders['Content-Type']
            headers['Authorization'] = defaultHeaders['Authorization']
            http_options.headers = headers
        }

        if (data) { http_options.body = data }
        return http_options
    }
}

const pageConfig = {
    "id": "api.page.all.settings",
    "ver": "v1",
    "ts": "2019-05-07 20:45:14:286+0530",
    "params": {
        "resmsgid": null,
        "msgid": "6925e1cc-6595-43ed-a7dd-19384a7ef1f1",
        "err": null,
        "status": "success",
        "errmsg": null
    },
    "responseCode": "OK",
    "result": {
        "page": [
            {
                "name": "User Courses",
                "portalSections": [
                    {
                        "display": "{\"name\":{\"en\":\"Ongoing Courses\"}}",
                        "alt": null,
                        "description": null,
                        "index": 1,
                        "sectionDataType": "coursebatch",
                        "imgUrl": null,
                        "searchQuery": "{\"request\":{\"query\":\"\",\"filters\":{\"status\":\"1\"},\"limit\":10,\"sort_by\":{\"createdDate\":\"desc\"}}}",
                        "name": "Ongoing Course",
                        "id": "0127029938411765763",
                        "dataSource": "batch",
                        "status": 1,
                        "group": 1
                    },
                    {
                        "display": "{\"name\":{\"en\":\"Upcoming Courses\"}}",
                        "alt": null,
                        "description": null,
                        "index": 1,
                        "sectionDataType": "coursebatch",
                        "imgUrl": null,
                        "searchQuery": "{\"request\":{\"query\":\"\",\"filters\":{\"status\":\"0\"},\"limit\":10,\"sort_by\":{\"createdDate\":\"desc\"}}}",
                        "name": "Upcoming Course",
                        "id": "0127029874436259843",
                        "dataSource": "batch",
                        "status": 1,
                        "group": 2
                    },
                    {
                        "display": "{\"name\":{\"en\":\"Expired Courses\"}}",
                        "alt": null,
                        "description": null,
                        "index": 1,
                        "sectionDataType": "coursebatch",
                        "imgUrl": null,
                        "searchQuery": "{\"request\":{\"query\":\"\",\"filters\":{\"status\":\"2\"},\"limit\":10,\"sort_by\":{\"createdDate\":\"desc\"}}}",
                        "name": "Expired Course",
                        "id": "0127029877022638081",
                        "dataSource": "batch",
                        "status": 1,
                        "group": 3
                    }
                ],
                "id": "0127029903393832964",
                "appSections": [
                    {
                        "display": "{\"name\":{\"en\":\"Ongoing Courses\"}}",
                        "alt": null,
                        "description": null,
                        "index": 1,
                        "sectionDataType": "coursebatch",
                        "imgUrl": null,
                        "searchQuery": "{\"request\":{\"query\":\"\",\"filters\":{\"status\":\"1\"},\"limit\":10,\"sort_by\":{\"createdDate\":\"desc\"}}}",
                        "name": "Ongoing Course",
                        "id": "0127029938411765763",
                        "dataSource": "batch",
                        "status": 1,
                        "group": 1
                    },
                    {
                        "display": "{\"name\":{\"en\":\"Upcoming Courses\"}}",
                        "alt": null,
                        "description": null,
                        "index": 1,
                        "sectionDataType": "coursebatch",
                        "imgUrl": null,
                        "searchQuery": "{\"request\":{\"query\":\"\",\"filters\":{\"status\":\"0\"},\"limit\":10,\"sort_by\":{\"createdDate\":\"desc\"}}}",
                        "name": "Upcoming Course",
                        "id": "0127029874436259843",
                        "dataSource": "batch",
                        "status": 1,
                        "group": 2
                    },
                    {
                        "display": "{\"name\":{\"en\":\"Expired Courses\"}}",
                        "alt": null,
                        "description": null,
                        "index": 1,
                        "sectionDataType": "coursebatch",
                        "imgUrl": null,
                        "searchQuery": "{\"request\":{\"query\":\"\",\"filters\":{\"status\":\"2\"},\"limit\":10,\"sort_by\":{\"createdDate\":\"desc\"}}}",
                        "name": "Expired Course",
                        "id": "0127029877022638081",
                        "dataSource": "batch",
                        "status": 1,
                        "group": 3
                    }
                ]
            },
            {
                "name": "ContentBrowser",
                "portalSections": [
                    {
                        "display": "{\"name\":{\"en\":\"Latest Resource\"}}",
                        "alt": null,
                        "description": null,
                        "index": 1,
                        "sectionDataType": "ContentBrowser",
                        "imgUrl": null,
                        "searchQuery": "{\"request\":{\"filters\":{\"contentType\":[\"Resource\"]},\"sort_by\":{\"lastUpdatedOn\":\"desc\"}}}",
                        "name": "Latest Resource",
                        "id": "01247222769795891223",
                        "dataSource": null,
                        "status": 1,
                        "group": 1
                    },
                    {
                        "display": "{\"name\":{\"en\":\"Most Downloaded Resource\"}}",
                        "alt": null,
                        "description": null,
                        "index": 1,
                        "sectionDataType": "ContentBrowser",
                        "imgUrl": null,
                        "searchQuery": "{\"request\":{\"filters\":{\"contentType\":[\"Resource\"]},\"sort_by\":{\"me_totalDownloads\":\"desc\"}}}",
                        "name": "Most Downloaded Resource",
                        "id": "01247222216654848022",
                        "dataSource": null,
                        "status": 1,
                        "group": 2
                    },
                    {
                        "display": "{\"name\":{\"en\":\"Latest Collection \"}}",
                        "alt": null,
                        "description": null,
                        "index": 1,
                        "sectionDataType": "ContentBrowser",
                        "imgUrl": null,
                        "searchQuery": "{\"request\":{\"filters\":{\"mimeType\":\"application/vnd.ekstep.content-collection\",\"contentType\":\"Collection\"},\"exists\":[\"lastUpdatedOn\"],\"sort_by\":{\"me_totalDownloads\":\"desc\"}}}",
                        "name": "Latest Collection",
                        "id": "01247222141931520021",
                        "dataSource": null,
                        "status": 1,
                        "group": 3
                    },
                    {
                        "display": "{\"name\":{\"en\":\"Most downloaded Collection\"}}",
                        "alt": null,
                        "description": null,
                        "index": 1,
                        "sectionDataType": "ContentBrowser",
                        "imgUrl": null,
                        "searchQuery": "{\"request\":{\"filters\":{\"mimeType\":\"application/vnd.ekstep.content-collection\",\"contentType\":\"Collection\"},\"sort_by\":{\"lastUpdatedOn\":\"me_totalDownloads\"}}}",
                        "name": "Most downloaded Collection",
                        "id": "01247222805417164824",
                        "dataSource": null,
                        "status": 1,
                        "group": 4
                    },
                    {
                        "display": "{\"name\":{\"en\":\"Most downloaded interactive Lesson MimeType only ECML\"}}",
                        "alt": null,
                        "description": null,
                        "index": 1,
                        "sectionDataType": "ContentBrowser",
                        "imgUrl": null,
                        "searchQuery": "{\"request\":{\"filters\":{\"mimeType\":\"application/vnd.ekstep.ecml-archive\",\"contentType\":\"Collection\"},\"sort_by\":{\"me_totalDownloads\":\"desc\",\"me_totalInteractions\":\"desc\"}}}",
                        "name": "Most downloaded interactive Lesson MimeType only ECML",
                        "id": "01247222953701376025",
                        "dataSource": null,
                        "status": 1,
                        "group": 5
                    },
                    {
                        "display": "{\"name\":{\"en\":\"Most downloaded Interactive WorkSheet\"}}",
                        "alt": null,
                        "description": null,
                        "index": 1,
                        "sectionDataType": "ContentBrowser",
                        "imgUrl": null,
                        "searchQuery": "{\"request\":{\"filters\":{\"mimeType\":\"application/vnd.ekstep.ecml-archive\",\"contentType\":\"Resource\",\"resourceType\":\"Worksheet\"},\"sort_by\":{\"me_totalDownloads\":\"desc\",\"me_totalInteractions\":\"desc\"}}}",
                        "name": "Most downloaded Interactive WorkSheet",
                        "id": "01247222653363814424",
                        "dataSource": null,
                        "status": 1,
                        "group": 6
                    },
                    {
                        "display": "{\"name\":{\"en\":\"Youtube - Most Downloaded\"}}",
                        "alt": null,
                        "description": null,
                        "index": 1,
                        "sectionDataType": "ContentBrowser",
                        "imgUrl": null,
                        "searchQuery": "{\"request\":{\"filters\":{\"objectType\":\"Content\",\"mimeType\":\"video/x-youtube\"},\"sort_by\":{\"me_totalDownloads\":\"desc\"}}}",
                        "name": "Youtube - Most Downloaded",
                        "id": "01247222658545254425",
                        "dataSource": null,
                        "status": 1,
                        "group": 7
                    },
                    {
                        "display": "{\"name\":{\"en\":\"PDF- Most Downloaded\"}}",
                        "alt": null,
                        "description": null,
                        "index": 1,
                        "sectionDataType": "ContentBrowser",
                        "imgUrl": null,
                        "searchQuery": "{\"request\":{\"filters\":{\"objectType\":\"Content\",\"mimeType\":\"application/pdf\"},\"sort_by\":{\"me_totalDownloads\":\"desc\"}}}",
                        "name": "PDF- Most Downloaded",
                        "id": "01247223048350105626",
                        "dataSource": null,
                        "status": 1,
                        "group": 8
                    },
                    {
                        "display": "{\"name\":{\"en\":\"Epub- Most Downloaded\"}}",
                        "alt": null,
                        "description": null,
                        "index": 1,
                        "sectionDataType": "ContentBrowser",
                        "imgUrl": null,
                        "searchQuery": "{\"request\":{\"filters\":{\"objectType\":\"Content\",\"mimeType\":\"application/epub\"},\"sort_by\":{\"me_totalDownloads\":\"desc\"}}}",
                        "name": "EPub- Most Downloaded",
                        "id": "01247223425971814427",
                        "dataSource": null,
                        "status": 1,
                        "group": 9
                    },
                    {
                        "display": "{\"name\":{\"en\":\"H5p- Most Downloaded\"}}",
                        "alt": null,
                        "description": null,
                        "index": 1,
                        "sectionDataType": "ContentBrowser",
                        "imgUrl": null,
                        "searchQuery": "{\"request\":{\"filters\":{\"objectType\":\"Content\",\"mimeType\":\"application/vnd.ekstep.h5p-archive\"},\"sort_by\":{\"me_totalDownloads\":\"desc\"}}}",
                        "name": "H5p- Most Downloaded",
                        "id": "01247223623681638427",
                        "dataSource": null,
                        "status": 1,
                        "group": 10
                    }
                ],
                "id": "01247223121336729629"
            },
            {
                "name": "Explore",
                "portalSections": [
                    {
                        "display": "{\"name\":{\"en\":\"Popular Books\"}}",
                        "alt": null,
                        "description": null,
                        "index": 1,
                        "sectionDataType": "content",
                        "imgUrl": null,
                        "searchQuery": "{\"request\":{\"filters\":{\"contentType\":[\"TextBook\"],\"status\":[\"Live\"]},\"sort_by\":{\"me_averageRating\":\"desc\"},\"limit\":10,\"exists\":[\"me_averageRating\"]}}",
                        "name": "Popular Books",
                        "id": "0125543478238740480",
                        "dataSource": null,
                        "status": 1,
                        "group": 1
                    },
                    {
                        "display": "{\"name\":{\"en\":\"Popular Story\",\"hi\":\"लोकप्रिय कहानी\"}}}",
                        "alt": null,
                        "description": null,
                        "index": 1,
                        "sectionDataType": "content",
                        "imgUrl": null,
                        "searchQuery": "{\"request\":{\"query\":\"\",\"filters\":{\"language\":[\"English\"],\"contentType\":[\"Story\"],\"status\":[\"Live\"]},\"sort_by\":{\"me_averageRating\":\"desc\"},\"limit\":10,\"exists\":[\"me_averageRating\"]}}",
                        "name": "Popular Story",
                        "id": "01228383384379392023",
                        "dataSource": null,
                        "status": 1,
                        "group": 2
                    },
                    {
                        "display": "{\"name\":{\"en\":\"Popular Worksheet\",\"hi\":\"लोकप्रिय वर्कशीट\"}} ",
                        "alt": null,
                        "description": null,
                        "index": 1,
                        "sectionDataType": "content",
                        "imgUrl": null,
                        "searchQuery": "{\"request\":{\"query\":\"\",\"filters\":{\"language\":[\"English\"],\"contentType\":[\"Worksheet\"],\"status\":[\"Live\"]},\"sort_by\":{\"me_averageRating\":\"desc\"},\"limit\":10,\"exists\":[\"me_averageRating\"]}}",
                        "name": "Popular Worksheet",
                        "id": "01228383082462412826",
                        "dataSource": null,
                        "status": 1,
                        "group": 3
                    }
                ],
                "id": "0125494048439992321",
                "appSections": []
            }
        ]
    }
}

module.exports = new PageService(pageConfig);