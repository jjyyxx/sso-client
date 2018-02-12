const Ob = window.Ob || {}

Ob.AuthClient = {
    Config: {
        ssoOrigin: 'https://id.ob-studio.cn',
        ssoPath: '/api/token.html',
        get ssoUrl() {
            return this.ssoOrigin + this.ssoPath
        },
        timeout: 0
    },
    query() {
        const loginFrame = document.createElement('iframe')
        loginFrame.style.visibility = 'hidden'
        loginFrame.style.width = '0'
        loginFrame.style.height = '0'
        loginFrame.style.margin = '0'
        loginFrame.style.padding = '0'
        document.body.appendChild(loginFrame)
        loginFrame.src = this.Config.ssoUrl
        return new Promise((resolve, reject) => {
            window.addEventListener('message', (event) => {
                if (event.origin !== this.Config.ssoOrigin)
                    return
                loginFrame.remove()
                if (event.data === undefined) {
                    reject()
                } else {
                    resolve(event.data)
                }
            }, false)
        })
    },
    getUserInfo(force = false) {
        return new Promise((resolve, reject) => {
            if (force || Cookies.get('token') === undefined) {
                this.query().then((data) => {
                    Cookies.set('token', data.token)
                    localStorage.setItem('userInfo', JSON.stringify(data))
                    resolve(data)
                }).catch(reject)
            } else {
                resolve(JSON.parse(localStorage.getItem('userInfo')))
            }
        })
    }
}