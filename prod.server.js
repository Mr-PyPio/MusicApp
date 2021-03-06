const bodyParser = require('body-parser')
const express = require('express')
const config = require('./config/index')
const axios = require('axios')
const port = process.env.PORT || config.build.port

const app = express()

const apiRoutes = express.Router()

app.get('/api/getTopBanner', function (req, res) {
	const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
	const jumpPrefix = 'https://y.qq.com/n/yqq/album/'
	axios.get(url, {
		headers: {
			referer: 'https://u.y.qq.com/',
			host: 'u.y.qq.com'
		},
		params: req.query
	}).then((response) => {
		response = response.data
		if (response.code === 0) {
			const slider = []
			const content = response.focus.data && response.focus.data.content
			if (content) {
				for (let i = 0; i < content.length; i++) {
					const item = content[i]
					const sliderItem = {}
					sliderItem.id = item.id
					sliderItem.linkUrl = jumpPrefix + item.jump_info.url + '.html'
					sliderItem.picUrl = item.pic_info.url
					slider.push(sliderItem)
				}
			}
			res.json({
				code: 0,
				data: {
					slider
				}
			})
		} else {
			res.json(response)
		}
	}).catch((e) => {
		console.log(e)
	})
})
app.get('/api/getDiscList', function(req, res) {
	var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
	axios.get(url, {
			headers: {
				// 通过node请求QQ接口，发送http请求时，修改referer和host
				referer: 'https://y.qq.com/',
				host: 'c.y.qq.com'
			},
			params: req.query // 把前端传过来的params，全部给QQ的url
		})
		.then(response => {
			// 成功与失败的回调
			res.json(response.data)
		})
		.catch(e => {
			console.log(e)
		})
})
app.post('/api/getPurlUrl', bodyParser.json(), function (req, res) {
	const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
	axios.post(url, req.body, {
		headers: {
			referer: 'https://y.qq.com/',
			origin: 'https://y.qq.com',
			'Content-type': 'application/x-www-form-urlencoded'
		}
	}).then((response) => {
		res.json(response.data)
	}).catch((e) => {
		console.log(e)
	})
})
app.get('/api/lyric', function(req, res) {
	var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

	axios.get(url, {
			headers: {
				// 通过node请求QQ接口，发送http请求时，修改referer和host
				referer: 'https://y.qq.com/',
				host: 'c.y.qq.com'
			},
			params: req.query // 把前端传过来的params，全部给QQ的url
		})
		.then(response => {
			var ret = response.data
if (typeof ret === 'string') {
var reg = /^\w+\(({[^()]+})\)$/
var matches = ret.match(reg)
if (matches) {
	ret = JSON.parse(matches[1])
}
}
res.json(ret)
		})
		.catch(e => {
			console.log(e)
		})
})
app.get('/api/getCdInfo', function(req, res) {
	var url =
		'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
	axios.get(url, {
			headers: {
				referer: 'https://y.qq.com/',
				host: 'c.y.qq.com'
			},
			params: req.query
		})
		.then(response => {
			let ret = response.data
			if (typeof ret === 'string') {
				const reg = /^\w+\(({.+})\)$/
				const matches = ret.match(reg)
				if (matches) {
					ret = JSON.parse(matches[1])
				}
			}
			res.json(ret)
		})
		.catch(e => {
			console.log(e)
		})
})
app.get('/api/search', function(req, res) {
	var url = 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp'
	axios.get(url, {
			headers: {
				referer: 'https://c.y.qq.com/',
				host: 'c.y.qq.com'
			},
			params: req.query
		})
		.then(response => {
			res.json(response.data)
		})
		.catch(e => {
			console.log(e)
		})
})

app.use('/api', apiRoutes)
// 将dist目录作为静态目录
app.use(express.static('./dist'))

module.exports = app.listen(port, function(err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
