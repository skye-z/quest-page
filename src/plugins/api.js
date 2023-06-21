import request from './request'
import md5 from 'js-md5'

function post(url, data) {
    return request({
        url: url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data)
    })
}

export const init = () => {
    return request({
        url: '/init',
        method: 'GET'
    })
}

export const sys = {
    getInfo: () => {
        return request({
            url: '/sys/info',
            method: 'GET'
        })
    },
    getUse: () => {
        return request({
            url: '/sys/use',
            method: 'GET'
        })
    }
}

export const user = {
    login: (name, pass) => {
        return post('/user/login', {
            name, pass: md5(pass)
        })
    },
    getList: () => {
        return request({
            url: '/user/list',
            method: 'GET'
        })
    },
    add: (name, pass, nickname, admin, edit) => {
        if (nickname == '' || nickname == undefined) nickname = name
        if (admin == undefined) admin = false
        if (edit == undefined) edit = false
        return post('/user/add', {
            name, pass: md5(pass), nickname, admin, edit
        })
    },
    edit: (id, name, pass, nickname, admin, edit) => {
        if (nickname == '' || nickname == undefined) nickname = name
        if (admin == undefined) admin = false
        if (edit == undefined) edit = false
        return post('/user/' + id, {
            name, pass: pass ? md5(pass) : '', nickname, admin, edit
        })
    },
    remove: (id) => {
        return request({
            url: '/user/' + id,
            method: 'DELETE'
        })
    },
}

export const subject = {
    getList: () => {
        return request({
            url: '/subject/list',
            method: 'GET'
        })
    },
    add: (name, tag) => {
        return post('/subject/add', {
            name, tag
        })
    },
    edit: (id, name, tag) => {
        return post('/subject/' + id, {
            name, tag
        })
    },
    remove: (id) => {
        return request({
            url: '/subject/' + id,
            method: 'DELETE'
        })
    },
}

export const question = {
    getList: (sid, keyword, page, number) => {
        let url = '/question/list?'
        if (sid) url += 'sid=' + sid + '&'
        if (keyword) url += 'keyword=' + keyword + '&'
        if (page) url += 'page=' + page + '&'
        if (number) url += 'number=' + number + '&'

        return request({
            url: url.substring(0, url.length - 1),
            method: 'GET'
        })
    },
    getNumber: (sid, keyword) => {
        let url = '/question/number?'
        if (sid) url += 'sid=' + sid + '&'
        if (keyword) url += 'keyword=' + keyword + '&'
        return request({
            url: url.substring(0, url.length - 1),
            method: 'GET'
        })
    },
    import: (sid, list) => {
        return post('/question/import', {
            sid, list
        })
    },
    add: (sid, level, type, question, options, answer) => {
        return post('/question/add', {
            sid, level, type, question, options, answer
        })
    },
    edit: (id, sid, level, type, question, options, answer) => {
        return post('/question/' + id, {
            sid, level, type, question, options, answer
        })
    },
    remove: (id) => {
        return request({
            url: '/question/' + id,
            method: 'DELETE'
        })
    },
}

export const exam = {
    getList: () => {
        return request({
            url: '/exam/list',
            method: 'GET'
        })
    },
    add: (name, sid, questions) => {
        return post('/exam/add', {
            name, sid, questions
        })
    },
    edit: (id, name, sid, questions) => {
        return post('/exam/' + id, {
            name, sid, questions
        })
    },
    remove: (id) => {
        return request({
            url: '/exam/' + id,
            method: 'DELETE'
        })
    },
}