const app = require("../server");
const request = require("supertest");

describe ("Testando User e suas ações",  () => {
    let tk = "";
    it ("Teste de Criação de usuário", async () => {
        const res = await request(app)
        .post('/auth/register')
        .send({
            name: "Julio",
            surname: "Alves",
            email: "julio@ufape.br",
            phone: "32988253003",
            gender: "masculino",
            birthDate: "1995-11-18T14:45:15",
            password: "teste"
        })
        
        expect(res.statusCode).toEqual(201)
        expect(res.body).toHaveProperty('user')
    }),
    it ("Teste de Criação de user com email repetido", async () => {
        const res = await request(app)
        .post('/auth/register')
        .send({
            name: "Luis",
            surname: "Filipe",
            email: "lf@ufape.br",
            phone: "87981253003",
            gender: "masculino",
            birthDate: "1999-11-18T14:45:15",
            password: "teste"
        })
        
        expect(res.statusCode).toEqual(400)
    }),


    it ("Teste de autenticacao de user existente", async () => {
        const res = await request(app)

        .post('/auth/authenticate')
        .send({
            email: "juaboredo@ufape.br",
            password: "teste"
        })
        expect(res.body).toHaveProperty('user')
        expect(res.body).toHaveProperty('token')
        tk = res.body.token;
    }),
    it ("Teste de autenticacao de user inexistente", async () => {
        const res = await request(app)

        .post('/auth/authenticate')
        .send({
            email: "luis@rocketseat.ufape.net",
            password: "123456r75"
        })
        expect(res.statusCode).toEqual(404)
    }),
    it ("Teste de validacao de token", async () => {
        const res = await request(app)
        
        .get('/')
        .set('Authorization', 'Bearer '+tk)
        
        expect(res.body).toHaveProperty('user')
        expect(res.body).toHaveProperty('ok')
    }),
    it ("Teste de autenticacao de user existente com senha errada", async () => {
        const res = await request(app)

        .post('/auth/authenticate')
        .send({
            email: "lf@ufape.br",
            password: "teste2"
        })
        expect(res.statusCode).toEqual(400)
    }),
    it ("Teste de validacao de token invalido/inexistente", async () => {
        const res = await request(app)
        
        .get('/')
        .set('Authorization', tk)
        
        expect(res.statusCode).toEqual(401)
    }),
    it ("Teste de update de user existente", async () => {
        const res = await request(app)

        .put('/auth/update')
        .set('Authorization', 'Bearer '+tk)
        .send({
            email: "lf@ufape.br",
            name: "Luis Filipe",
            surname: "Santos Seixas"
        })
        expect(res.body).toHaveProperty('user')
        expect(res.body).toHaveProperty('token')
        expect(res.statusCode).toEqual(200)
    }),

    it ("Teste de criar evento", async () => {
        const res = await request(app)

        .post('/event')
        .set('Authorization', 'Bearer '+tk)
        .send({
        promoter: "60b29fcafb05fa0b566b94c3",
        name: "Forró do Tonho",
        description: "Showzinho de forró pé de serra com José do Acordeon e Armstrong do Pandeiro",
        category: "Música",
        value: 0,
        date: "2001-01-28T14:45:15",
        keywords: ["Forro","Musica"],
        localization: { street: "Rua Principal",
        city: "Garanhuns",
        CEP: "55299387",
        number: 400},
        link: "youtube.com/canaldotonho",
        isOnline: true,
        isLocal: true
    })
        expect(res.statusCode).toEqual(201)
        expect(res.body).toHaveProperty('event')
    }),
    it ("Teste de criar evento presencial sem local", async () => {
        const res = await request(app)

        .post('/event')
        .set('Authorization', 'Bearer '+tk)
        .send({
        promoter: "60b29fcafb05fa0b566b94c3",
        name: "Forró do Tonho",
        description: "Showzinho de forró pé de serra com José do Acordeon e Armstrong do Pandeiro",
        category: "Música",
        value: 0,
        date: "2001-01-28T14:45:15",
        keywords: ["Forro","Musica"],
    
        link: "youtube.com/canaldotonho",
        isOnline: true,
        isLocal: true
    })
        expect(res.statusCode).toEqual(400)
    }),
    it ("Promover usuário para promotor de eventos", async() => {
        const res = await request(app)

        .put('/auth/promote')
        .set('Authorization', 'Bearer '+tk)
        .send({
            email: "julio@ufape.br",
            CPF_CNPJ: "05886416457"
        })

        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('user')
        expect(res.body).toHaveProperty('token')
    }),
    it ("Promover usuário para promotor de eventos com CPF já em uso", async() => {
        const res = await request(app)

        .put('/auth/promote')
        .set('Authorization', 'Bearer '+tk)
        .send({
            email: "lf@ufape.br",
            CPF_CNPJ: "05801485088"
        })

        expect(res.statusCode).toEqual(400)
    }),
    it ("Promover usuário para promotor de eventos com user já como promotor", async() => {
        const res = await request(app)

        .put('/auth/promote')
        .set('Authorization', 'Bearer '+tk)
        .send({
            email: "lf@ufape.br",
            CPF_CNPJ: "05801485080"
        })

        expect(res.statusCode).toEqual(400)
    }),
    it ("Receber usuário", async() => {
        const res = await request(app)

        .get('/auth/user')
        .set('Authorization', 'Bearer '+tk)
        .send({
            email: "lf@ufape.br",
            CPF_CNPJ: "05801485080"
        })

        expect(res.statusCode).toEqual(200)
    })
})

describe ("Testando Listagens de eventos",  () => {
    it ("Receber todos Eventos", async() => {
        const res = await request(app)

        .get('/event')
        .send({})

        expect(res.statusCode).toEqual(200)
    },30000),
    it ("Receber todos Eventos Presenciais", async() => {
        const res = await request(app)

        .get('/eventpresential')
        .send({})

        expect(res.statusCode).toEqual(200)
    },30000),
    it ("Receber todos Eventos Online", async() => {
        const res = await request(app)

        .get('/eventonline')
        .send({})

        expect(res.statusCode).toEqual(200)
    },30000),
    it ("Receber todos Eventos Presenciais dado nome e/ou categoria", async() => {
        const res = await request(app)

        .get('/eventpresential')
        .send({category: "Música"})

        expect(res.statusCode).toEqual(200)
    },30000),
    it ("Receber todos Eventos Online dado nome e/ou categoria", async() => {
        const res = await request(app)

        .get('/eventonline')
        .send({category: "Shows", name: "Sao"})

        expect(res.statusCode).toEqual(200)
    },30000)
})
