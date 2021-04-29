const express = require('express');
const router = express.Router();
const Product = require('../models/Product')

router.get('/product/new', (req,res)=>{
    res.render('product/new-product')
});

router.post('/product/new-product', async(req,res)=>{
    const {name,amount,price,description,image} = req.body;
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
        const newProduct = new Product({name,amount,price,description,image});
        await newProduct.save();
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
    const {name,amount,price,description,image} = req.body;
    await Product.findByIdAndUpdate(req.params.id, {name,amount,price,description,image});
    req.flash('success_msg',"Product update successfully");
    res.redirect('/product');
})

router.delete('/product/delete/:id', async (req,res)=>{
    await Product.findByIdAndDelete(req.params.id);
    req.flash('success_msg',"Product deleted successfully");
    res.redirect('/product');
})
module.exports = router;