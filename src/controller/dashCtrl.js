const mongoose = require('mongoose')
const Task = require('../model/taskModel')
const nodemailer =  require('nodemailer');

const dashCtrl = {
    dashboard: async (req, res) => {
        const locals = {
            title: 'Dashboard',
            description: 'My super app'
        }

        const perPage = 8
        const page = req.query.page || 1
        try {
            //tasks
            const tasks = await Task.aggregate([
                {$sort: {updatedAt: -1}},
                {$match: {user: new mongoose.Types.ObjectId(req.user.id)}}
            ]).skip(perPage*page - perPage).limit(perPage).exec()

            const count = await Task.find({user: req.user.id}).count()
            

            res.render('dashboard/index', {userName: req.user.firstName, locals, tasks, current: page, pages: Math.ceil(count/perPage), layout: '../views/layouts/dashboard'})
        } catch (error) {
            console.log(error);
        }
    },
    // get create task page
    addPage: async (req, res) => {
        res.render('dashboard/add', {layout: '../views/layouts/dashboard'})
    },
    // add new task
    addTask: async (req, res) => {
        req.body.user = req.user.id
        try {
            await Task.create(req.body)
            res.redirect('/dashboard')
        } catch (error) {
            console.log(error);
        }
    },
    // view a task
    viewTask: async(req, res) => {
        const {id} = req.params
        try {
            const task = await Task.findById(id)
            if(task){
                res.render('dashboard/view-task', {taskId: id, task, layout: '../views/layouts/dashboard'} )
            } else {
                res.send('Something went wrong!')
            }
        } catch (error) {
            console.log(error);
        }
    },
    //update a task
    updateTask: async(req, res) => {
        const {id} = req.params
        const {title, body} = req.body
        try {
            await Task.findByIdAndUpdate({_id: id}, {title, body, updatedAt: Date.now()})
            res.redirect('/dashboard')
        } catch (error) {
            console.log(error);
        }
    },
    deleteTask: async (req, res) => {
        const {id} = req.params
        try {
            await Task.findByIdAndDelete(id)
            res.redirect('/dashboard')
        } catch (error) {
            console.log(error);
        }
    },
    //search tasks page get
    searchTask: async (req, res) => {
        try {
            res.render('dashboard/search', {searchResult: '', layout: '../views/layouts/dashboard'})
        } catch (error) {
            console.log(error);
        }
    },
    //search post task
    searchResult: async (req, res) => {
        const {termin} = req.body
        try {
            const key = new RegExp(termin, 'i')
            const searchResult = await Task.find({
                $or: [{title: {$regex: key}}, {body: {$regex: key}}]
            })
            res.render('dashboard/search', {searchResult, layout: '../views/layouts/dashboard'})
        } catch (error) {
            console.log(error);
        }
    },
    error: async (req, res) => {
        try {
            res.render('404')
        } catch (error) {
            console.log(error);
        }
    },
    sendContact: async (req, res) => {
        try {
            res.render('dashboard/contact', { layout: '../views/layouts/dashboard'})
        } catch (error) {
            console.log(error);
        }
    },
    sendMessage: async (req, res) => {
        const {name, company, email, phone, message} = req.body
        try {
            const config = {
                service: 'gmail',
                auth: {
                    user: 'aba06096@gmail.com',
                    pass: 'ehty zgha skkp zgdo'
                }
            }
            let transporter = nodemailer.createTransport(config);
            const output = `
            <div class="logo" style="display: flex; width: 100%; height: 300px; padding: 20px; margin: 20px auto; overflow: hidden; text-align: center; box-shadow: 0 0 10px black; border-radius: 50%;">
                <img style='width: 200px; background: transparent; object-fit: cover;' src='https://st3.depositphotos.com/43745012/44906/i/450/depositphotos_449066958-stock-photo-financial-accounting-logo-financial-logo.jpg' alt='logo_site' >
                <h2 style='font-size: 40px; margin: auto 50px;'>Task App</h2>
            </div>
            <h3 style='text-align: center;'>Contact Details</h3>    
            <ul style='list-style-type: none; margin: 0 auto; padding: 50px;'>
                <li>Name: <span style="font-weight: bold; font-size: 20px;">${name}</span></li>
                <li>Company: <span style="font-weight: bold; font-size: 20px;">${company}</span></li>
                <li>Email: <a href='mailto:${email}' style="font-weight: bold; font-size: 20px; text-decoration: underline;">${email}</a></li>
                <li>Phone: <a href='tel:${phone}' style="font-weight: bold; font-size: 20px;">${phone}</a></li>
                <li style="text-align: center;">Message: <br> <span style="font-weight: bold; font-size: 18px;">${message} Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nisi esse dicta nesciunt iste dolore, consequatur ratione doloribus, temporibus alias unde, culpa aspernatur quod? Dolorum eius dolor, a commodi sunt nihil assumenda blanditiis error expedita earum ut voluptatum vero, minus dolores ducimus quam corrupti, iusto deserunt et quae officia incidunt id? Molestiae, nisi? Rerum, voluptas repellendus aperiam tenetur quae eaque corporis distinctio? Corrupti quae iste tempora repudiandae accusamus, eaque dolor dolores mollitia suscipit animi ut, eveniet id earum ex aliquam blanditiis, nobis deserunt nemo itaque voluptates laudantium adipisci explicabo quasi necessitatibus! Aliquid amet natus quisquam, possimus nesciunt harum laborum sed facilis.</span></li>
            </ul>
            `
            const msg = {
                to: ["aba06096@gmail.com"],
                from: email,
                subject: 'Contact Request via Nodmailer',
                text: 'Mail is sent by sendgrid App',
                html: output 
            }
            transporter.sendMail(msg)
            res.render('dashboard/status')
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = dashCtrl