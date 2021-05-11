const express = require('express');
const router = express.Router();
const Product = require('../models/Product')
const {unlink} = require('fs-extra')
const path = require('path')

const fs = require('fs-extra');
const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: '<private>',
    api_key: private,
    api_secret: 'private'
})

router.get('/product/new', (req,res)=>{
    res.render('product/new-product')
});

router.post('/product/new-product', async(req,res)=>{
    const {name,amount,price,description} = req.body;
    const errors = [];
    if(!name){
        errors.push({text:'Please insert a name'})
    }
    if(!description){
        errors.push({text:'Please insert a description'})
    }
    if(errors.length > 0 ){
        res.render('product/new-product',{
            errors, 
            description, 
            amount, 
            price, 
            name,
            image
        })
    }else{
        const nimage = await cloudinary.uploader.upload(req.file.path);
        const newProduct = new Product({name,amount,price,description, imageURL:nimage.url, public_id: nimage.public_id});
        await newProduct.save();
        await fs.unlink(req.file.path);
        req.flash('success_msg',"Product Added Susscessfully")
        res.redirect('/product')
    }
});

router.get('/product', async(req,res)=>{
    const product = await Product.find().lean();
    res.render('product/all-products', {product})
})

router.get('/product/edit/:id', async (req,res)=>{
    const product = await Product.findById(req.params.id).lean();
    res.render('product/edit-product', {product})
})

router.put('/product/edit-product/:id', async(req,res)=>{
    const {name,amount,price,description} = req.body;
    await Product.findByIdAndUpdate(req.params.id, {name,amount,price,description});
    req.flash('success_msg',"Product update successfully");
    res.redirect('/product');
})

router.get('/product/:id', async(req,res)=>{
    const { id } = req.params;
    const product = await Product.findById(id).lean();
    console.log(product)
    res.render('product/product-profile', {product})
})

router.delete('/product/delete/:id', async (req,res)=>{
    const product = await Product.findByIdAndDelete(req.params.id);
    cloudinary.uploader.destroy(product.public_id)
    unlink(path.resolve('./src/public/' + product.path))
    req.flash('success_msg',"Product deleted successfully");
    res.redirect('/product');
})
module.exports = router;