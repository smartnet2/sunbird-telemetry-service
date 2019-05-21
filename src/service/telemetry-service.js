const uuidv1 = require('uuid/v1'),
    request = require('request'),
    DispatcherClass = require('../dispatcher/dispatcher').Dispatcher;
    var rest = require('restler')
config = require('../envVariables')
var async = require('async');
var urlConfig = require('./../config/config.json');
var obj;

// TODO: Make this efficient. Implementation to be similar to typesafe config. Right now one configuration holds 
// together all supported transport configurations

class TelemetryService {
  constructor(Dispatcher, config) {
    this.config = config;
    this.dispatcher = this.config.localStorageEnabled === 'true' ? new Dispatcher(config) : undefined;
    obj = this;
  }
  dispatch(req, res) {
    const message = req.body;
    const events = message.events;
    var parameterArray = events;
    var returnArray = [];

    async.each(parameterArray, function (param, eachCb) {
      console.log('object id==========>', param.object.id);
      if (param.object.id != undefined) {
        var url = obj.config.baseUrl + urlConfig.API.READ_CONTENT_URI + param.object.id;
        rest.get(url).on('complete', function (data) {
          var processedData = data;
          if (processedData && processedData.result) {
            //assign to param
            param.object.name = processedData.result.content.name;
            returnArray.push(param);
            return eachCb(null);
          }
        });
      } else {
        returnArray.push(param);
        eachCb(null);
      }
    }, function (cb) {
      req.body.events = returnArray;
      message.did = req.get('x-device-id');
      message.channel = req.get('x-channel-id');
      message.pid = req.get('x-app-id');
      if (!message.mid) message.mid = uuidv1();
      message.syncts = new Date().getTime();
      const data = JSON.stringify(message);
      if ((obj.config.localStorageEnabled === 'true' || obj.config.telemetryProxyEnabled === 'true')) {
        if (obj.config.localStorageEnabled === 'true' && obj.config.telemetryProxyEnabled !== 'true') {
          // Store locally and respond back with proper status code
          obj.dispatcher.dispatch(message.mid, data, obj.getRequestCallBack(req, res));
        } else if (obj.config.localStorageEnabled === 'true' && obj.config.telemetryProxyEnabled === 'true') {
          // Store locally and proxy to the specified URL. If the proxy fails ignore the error as the local storage is successful. Do a sync later
          const options = obj.getProxyRequestObj(req, data);
          request.post(options, (err, data) => {
            if (err) console.error('Proxy failed:', err);
            else console.log('Proxy successful!  Server responded with:', data.body);
          });
          obj.dispatcher.dispatch(message.mid, data, obj.getRequestCallBack(req, res));
        } else if (obj.config.localStorageEnabled !== 'true' && obj.config.telemetryProxyEnabled === 'true') {
          // Just proxy
          const options = obj.getProxyRequestObj(req, data);
          request.post(options, obj.getRequestCallBack(req, res));
        }
      } else {
        obj.sendError(res, { id: 'api.telemetry', params: { err: 'Configuration error' } });
      }
    });
  }
    health(req, res) {
        if (this.config.localStorageEnabled === 'true') {
            this.dispatcher.health((healthy) => {
                if (healthy)
                    this.sendSuccess(res, { id: 'api.health' });
                else
                    this.sendError(res, { id: 'api.health', params: { err: 'Telemetry API is unhealthy' } });
            })
        } else if (this.config.telemetryProxyEnabled === 'true') {
            this.sendSuccess(res, { id: 'api.health' });
        } else {
            this.sendError(res, { id: 'api.health', params: { err: 'Configuration error' } });
        }
    }
    getRequestCallBack(req, res) {
        return (err, data) => {
            if (err) {
                console.log('error', err);
                this.sendError(res, { id: 'api.telemetry', params: { err: err } });
            }
            else {
                this.sendSuccess(res, { id: 'api.telemetry' });
            }
        }
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
            responseCode: options.responseCode || 'SUCCESS'
        }
        res.status(200);
        res.json(resObj);
    }
    getProxyRequestObj(req, data) {
        const headers = { 'authorization': 'Bearer ' + config.proxyAuthKey };
        if (req.get('content-type')) headers['content-type'] = req.get('content-type');
        if (req.get('content-encoding')) headers['content-encoding'] = req.get('content-encoding');
        return {
            url: this.config.proxyURL,
            headers: headers,
            body: data
        };
    }
}

module.exports = new TelemetryService(DispatcherClass, config);
