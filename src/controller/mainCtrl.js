const mainCtrl = {
    home: async (req, res) => {
        const locals = {
            title: 'NodeJs Task App',
            description: 'Free NodeJs Tasks App'
        }

        res.render('index', {locals, layout: '../views/layouts/front-page'})
    },
    about: async (req, res) => {
        const locals = {
            title: 'About NodeJs Task App',
            description: 'Free NodeJs Tasks App'
        }

        res.render('about', {locals})
    }
}

module.exports = mainCtrl