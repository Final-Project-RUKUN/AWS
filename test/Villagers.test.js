const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../app')
const { User } = require('../models')

let access_token_member = null

let access_token_admin = null


beforeAll(async function(done){
  try {
    const dataAdmin = await User.findOne({where: {username: "Makarya"}})

    const dataMember = await User.findOne({where: {username: "MakmurJaya"}})

    access_token_admin = jwt.sign({id: dataAdmin.id, username: dataAdmin.username}, process.env.KEY)

    access_token_member = jwt.sign({id: dataMember.id, username: dataMember.username}, process.env.KEY)

    done()
     
  } catch 
  (error) {
    done(error)
  }
})

//! SCOPE SUCCESS
describe("ROLE ADMIN CAN FETCH, EDIT AND DELETE USER", function(){
  //CREATE suggestion
  it("POST /villagers - 201 OK", function(done) {

  request(app)
    .get("/villagers")
    .set({ access_token: access_token_admin })
    .end(function(err,res){
        if(err) done(err)
        else {
          expect(res.statusCode).toEqual(200)
          expect(Array.isArray(res.body.Users)).toEqual(true)
          expect(typeof res.body.Users[0]).toEqual('object')
          expect(res.body.Users[0]).toHaveProperty("id")
          expect(typeof res.body.Users[0].id).toEqual("number")
          expect(res.body.Users[0]).toHaveProperty("name")
          expect(typeof res.body.Users[0].name).toEqual("string")
          expect(res.body.Users[0]).toHaveProperty("username")
          expect(typeof res.body.Users[0].username).toEqual("string")
          expect(res.body.Users[0]).toHaveProperty("role")
          expect(typeof res.body.Users[0].role).toEqual("string")
          expect(res.body.Users[0]).toHaveProperty("VillageId")
          expect(typeof res.body.Users[0].VillageId).toEqual("number")
          expect(res.body.Users[0]).toHaveProperty("push_token")
          expect(typeof res.body.Users[0].push_token).toEqual("string")
          done()
        }
      })
  })

  //DELETE USER
  it("DELETE /user - 200 OK", function(done) { 
    
    request(app)
      .delete("/user/123")
      .set({ access_token : access_token_admin })
      .end(function(err, res){
        if(err) done(err)
        else {
          expect(res.statusCode).toEqual(200)
          expect(typeof res.body).toEqual("object")
          expect(res.body).toHaveProperty("message")
          expect(res.body.message).toEqual("Successfully deleted user")

          done()
        }
      })
  })

  // DELETE VILLAGE
  it("DELETE /villagers - 200 OK", function(done) { 
      
    request(app)
      .delete("/villagers/19")
      .set({ access_token : access_token_admin })
      .end(function(err, res){
        if(err) done(err)
        else {
          expect(res.statusCode).toEqual(200)
          expect(typeof res.body).toEqual("object")
          expect(res.body).toHaveProperty("message")
          expect(res.body.message).toEqual("Success Delete Village")

          done()
        }
      })
  })

  it("GET/user - 200 OK", function(done) { 
          
    request(app)
      .get("/user/11")
      .set({ access_token: access_token_admin })
      .end(function(err, res){
        if(err) done(err)
        else {
          expect(res.statusCode).toEqual(200)   
          expect(typeof res.body).toEqual('object')
          expect(res.body).toHaveProperty("id")
          expect(typeof res.body.id).toEqual("number")
          expect(res.body).toHaveProperty("name")
          expect(typeof res.body.name).toEqual("string")
          expect(res.body).toHaveProperty("username")
          expect(typeof res.body.username).toEqual("string")
          expect(res.body).toHaveProperty("role")
          expect(typeof res.body.role).toEqual("string")
          expect(res.body).toHaveProperty("VillageId")
          expect(typeof res.body.VillageId).toEqual("number")
          done()
        }
      })
  })

  it("PUT /user - 200 OK", function(done) { 
    
    request(app)
      .put("/admin/change/25")
      .set({ access_token: access_token_admin })
      .end(function(err, res){
        if(err) done(err)
        else {
          expect(res.statusCode).toEqual(200)
          expect(typeof res.body).toEqual("object")
          expect(res.body).toHaveProperty("message")
          expect(res.body.message).toEqual("Successfully change role admin")

          done()
        }
      })
  })
})

//! SCOPE ERROR
describe("ERROR UNAUTHORIZED", function(){
  //GET USER ERROR NOT ADMIN
  it("GET /villagers - 401 UNAUTHORIZED", function(done) {

  request(app)
    .get("/villagers")
    .set({ access_token: access_token_member })
    .end(function(err,res){
        if(err) done(err)
        else {
          expect(res.statusCode).toEqual(401)
          expect(typeof res.body).toEqual("object")
          expect(res.body).toHaveProperty("message")
          expect(res.body.message).toEqual("Unauthorized")
          done()
        }
      })
  })

  //DELETE USER ERROR NOT ADMIN
  it("DELETE /user - 401 UNAUTHORIZED", function(done) { 
    
    request(app)
      .delete("/user/24")
      .set({ access_token : access_token_member })
      .end(function(err, res){
        if(err) done(err)
        else {
          expect(res.statusCode).toEqual(401)
          expect(typeof res.body).toEqual("object")
          expect(res.body).toHaveProperty("message")
          expect(res.body.message).toEqual("Unauthorized")
          done()
        }
      })
  })

  //DELETE VILLAGE ERROR NOT ADMIN
  it("DELETE /user - 401 Unauthorized", function(done) { 
      
    request(app)
      .delete("/villagers/8")
      .set({ access_token : access_token_member })
      .end(function(err, res){
        if(err) done(err)
        else {
          expect(res.statusCode).toEqual(401)
          expect(typeof res.body).toEqual("object")
          expect(res.body).toHaveProperty("message")
          expect(res.body.message).toEqual("Unauthorized")
          done()
        }
      })
  })

  //PUT  ERROR NOT ADMIN
  it("PUT /user - 401 Unauthorized", function(done) { 
    
    request(app)
      .put("/admin/change/20")
      .set({ access_token: access_token_member })
      .end(function(err, res){
        if(err) done(err)
        else {
          expect(res.statusCode).toEqual(401)
          expect(typeof res.body).toEqual("object")
          expect(res.body).toHaveProperty("message")
          expect(res.body.message).toEqual("Unauthorized")
          done()
        }
      })
  })
  it("GET/user - 200 OK", function(done) { 
    
    request(app)
      .get("/user/11")
      .set({ access_token: access_token_member })
      .end(function(err, res){
        if(err) done(err)
        else {
          expect(res.statusCode).toEqual(401)
          expect(typeof res.body).toEqual("object")
          expect(res.body).toHaveProperty("message")
          expect(res.body.message).toEqual("Unauthorized")
          done()
        }
      })
  })
})
