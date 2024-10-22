const User = require('../models/User')

const bcrypt = require('bcryptjs')

module.exports = class AuthController {
    static login(req, res) {
        res.render('auth/login')
      }
    
      static async loginPost(req, res) {
        const { email, password } = req.body
    
        // achar user
        const user = await User.findOne({ where: { email: email } })
    
        if (!user) {
          res.render('auth/login', {
            message: 'Usuário não encontrado!',
          })
    
          return
        }

        //checar senha
        const passwordMatch = bcrypt.compareSync(password, user.password)

        if (!passwordMatch) {
          res.render('auth/login', {
            message: 'Senha inválida!',
          })
    
          return
        }

        // auth user
        req.session.userid = user.id

        req.flash('message', 'Login realizado com sucesso!')
    
        req.session.save(() => {
          res.redirect('/')
        })
      }

    static register(req, res) {
        res.render('auth/register')
    }

    static async registerPost(req, res) {
        const { name, email, password, confirmpassword } = req.body

        //validação de senha
        if(password !== confirmpassword) {
            req.flash('message', 'As senhas nao conferem, tente novamente!')
            res.render('auth/register')

            return
        }

        //checagem de usuario existente
        const checkUserExist = await User.findOne({where: {email: email}})

        if(checkUserExist) {
            req.flash('message', 'Esse e-mail já sendo utilizado!')
            res.render('auth/register')

            return
        }

        //criar senha
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password: hashedPassword
        }

        User.create(user)
      .then((user) => {
        // initialize session
        req.session.userid = user.id


        req.flash('message', 'Cadastro realizado com sucesso!')

        req.session.save(() => {
          res.redirect('/')
        })
      })
      .catch((err) => console.log(err))
    }

    static logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }
}
