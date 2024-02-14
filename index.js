const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const fileUpload = require('express-fileupload')
const joi = require('joi')
const fs = require('fs')
var cors = require('cors')

app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(fileUpload())

let product = [
  {
    id: 1,
    name: "Dry Food Whiskas",
    description: "Makanan renyah untuk Kucing kesayangan anda",
    price: 40000,
    stock: 30,
    type: "Food",
    image: "/images/DryFood_Whiskas.jpg",
  },
  {
    id: 2,
    name: "Wet Food Whiskas",
    description: "Makanan basah untuk Kucing kesayangan anda",
    price: 30000,
    stock: 15,
    type: "Food",
    image: "/images/WetFood_Whiskas.jpg",
  },
  {
    id: 3,
    name: "Kalung Kucing",
    description: "Kalung lucu untuk kucing kesayangan anda",
    price: 7000,
    stock: 40,
    type: "Aksesoris",
    image: "/images/Acc_Kalung_Kucing.jpg",
  }
]


const validateProduct = (product) => {
  const schema = joi.object({
    name: joi.string().min(3).required(),
    description: joi.string().min(3).required(),
    price: joi.number().required(),
    stock: joi.number().required(),
    type: joi.string().min(3).required()
  })

  return schema.validate(product)
}

app.get('/', (req, res) => {
  res.send('Selamat Datang di PetShop Semoga Sukses')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


//product

//get data
app.get('/product', (req, res) => {
  //search by name
  const name = req.query.name
    if(name){
      const searchproductname = product.find(searchproductname => searchproductname.name.toLowerCase() == name)

      if(!searchproductname){
        res.status(404).json({
          messages: "Data Not Found"
        })
      }

      res.status(200).json({
        messages: "Success Get Detail Data",
        data: searchproductname
      })
    }

    //search by type
    resulttype = []
    const type = req.query.type
    if(type){
      product.forEach(product =>{
      if(product.type.toLowerCase() == type.toLowerCase()) {
          resulttype.push(product)
      }
        });

      if(resulttype.length === 0){
        res.status(404).json({
          messages: "Data Not Found"
        })
      }

      res.status(200).json({
        messages: "Success Get Detail Data",
        data: resulttype
      })
    }

    res.status(200).json({
      messages: "Success Get All Data",
      data: product
    })
})

//get detail product by id
app.get('/product/:id', (req, res) => {
  const id = req.params.id

  const searchproductid = product.find(searchproductid => searchproductid.id == id)

  if(!searchproductid){
    res.status(404).json({
      messages: "Data Not Found"
    })
  }

  res.status(200).json({
    messages: "Success Get Detail Data",
    data: searchproductid
  })
})

//add data product
app.post('/product', (req, res) => {
  const {name, description, price, stock, type} = req.body
  const id = product.length + 1;

  const{error} = validateProduct(req.body)

  if(error){
    return res.status(400).json({
      messages: error.details[0].message
    })
  }

  const image = req.files.image
  const filename = `${type}_${name}.jpg`

  image.mv(path.join(__dirname, 'public/images', filename))

  const newProduct = {
    id,
    name,
    description,
    price,
    stock,
    type,
    image: `/image/${filename}`
  }

  console.log(newProduct)

  product.push(newProduct)

  res.status(201).json({
    messages: "Success Add Data",
    data: newProduct
  })
})

//edit product
app.put('/product/:id', (req, res) => {
  const id = req.params.id
  const {name, description, price, stock, type} = req.body

  const {error} = validateProduct(req.body)

  if(error) {
    return res.status(400).json({
      messages: error.details[0].message
    })
  }

  const searchproductid = product.find(searchproductid => searchproductid.id == id)

  if(!searchproductid){
    return res.status(404).json({
      messages: "Data Not Found"
    })
  }

  const fileNameOld = `${searchproductid.type}_${searchproductid.name}.jpg`
  searchproductid.name = name
  searchproductid.description = description
  searchproductid.price = price
  searchproductid.stock = stock
  searchproductid.type = type

  const image = req.files.image
  if(image) {
    try{
      fs.unlinkSync(path.join(__dirname, 'public/images', fileNameOld))
    }catch(err) {
      console.log(err)
    }
    const filename = `${type}_${name}.jpg`
    console.log(image.mv(path.join(__dirname, 'public/images', filename)))
    searchproductid.image = `/images/${filename}`
  }

  res.status(200).json({
    messages: "Success Update Data",
    data: product
  })
})

// delete product
app.delete('/product/:id', (req, res) => {
  const id = req.params.id

  const searchproductid = product.find(searchproductid => searchproductid.id == id)

  if(!searchproductid) {
    return res.status(404).json({
      messages: "Data Not Found"
    })
  }

  const index = product.indexOf(product)
  product.splice(index, 1)

  res.status(200).json({
    messages: "Success Delete Data",
    data: product
  })
})

//checkout
let cart = [{
  id: 1,
  name: "Dummy",
  price: 5000,
  total: 2,
}]

//get all checkout
app.get('/checkout', (req, res) => {
  res.status(200).json({
    messages: "Success Get All Data keranjang",
    data: cart
  })
})

//add checkout
app.post('/checkout', (req, res) => {
  const {id, total} = req.body
  const dataProduct = product.find(barang => barang.id == id)

  if(!dataProduct){
    return res.status(404).json({
      message: "Barang tidak ditemukan"
    })
  }

  const indexCart = cart.findIndex(barang => barang.id == id);

  if(indexCart != -1){
    if (dataProduct.stock < cart[indexCart].total + parseInt(total)) {
      return res.status(400).json({
        message: "Jumlah barang melebihi stok yang tersedia"
      });
    }
    cart[indexCart].total += parseInt(total)
    return res.status(201).json({
      message: "Total Barang berhasil Ditambah",
      data: cart
    })
  }

  if (dataProduct.stock < parseInt(total)) {
    return res.status(400).json({
      message: "Jumlah barang melebihi stok yang tersedia"
    });
  }

  cart.push({
    id: dataProduct.id,
    name: dataProduct.name,
    price: dataProduct.price,
    total: parseInt(total),
  })

  return res.status(201).json({
    message: "Barang berhasil ditambahkan ke keranjang",
    data: cart
  })
})

//delete cart
app.delete('/checkout/:id', (req, res) => {
  const{id} = req.params

  const indexCart = cart.findIndex(barang => barang.id == id);
  cart.splice(indexCart, 1)

  return res.status(201).json({
    message: "Barang berhasil dihapus dari keranjang",
    data: cart
  })
})

//checkout pembayaran
app.post('/checkout/payment', (req, res) => {
  const{bank} = req.body

  const totalPrice = cart.reduce((barang, item) => {
    return barang + (item.price * item.total)
  },0)

  cart.forEach(item => {
    const productToUpdate = product.find(product => product.id === item.id);
    if (productToUpdate) {
      productToUpdate.stock -= item.total;
    }
  });

  cart = []

  return res.status(201).json({
    message: `Pembayaran sukses silahkan bayar ke ${bank}`,
    total: totalPrice,
    method: bank
  })
})



