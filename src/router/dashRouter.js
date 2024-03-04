const router = require('express').Router()
const isLogin = require('../middleware/checkAuth')
const dashCtrl = require('../controller/dashCtrl')

router.get('/dashboard', isLogin, dashCtrl.dashboard)
router.get('/dashboard/add', isLogin, dashCtrl.addPage)
router.get('/dashboard/item/:id', isLogin, dashCtrl.viewTask)
router.post('/dashboard/update/:id', isLogin, dashCtrl.updateTask)
router.get('/dashboard/delete/:id', isLogin, dashCtrl.deleteTask)
router.post('/dashboard/add', isLogin, dashCtrl.addTask)
router.get('/dashboard/search', isLogin, dashCtrl.searchTask)
router.post('/dashboard/search', isLogin, dashCtrl.searchResult)
router.get('/dashboard/contact', isLogin, dashCtrl.sendContact)
router.post('/dashboard/send', isLogin, dashCtrl.sendMessage)

module.exports = router