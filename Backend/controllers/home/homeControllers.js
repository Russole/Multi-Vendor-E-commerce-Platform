const categoryModel = require('../../models/categoryModel');
const productModel = require('../../models/productModel');
const reviewModel = require('../../models/reviewModel')
const { responseReturn } = require("../../utils/response");
const queryProducts = require('../../utils/queryProducts');
const moment = require('moment');
const { mongo: { ObjectId } } = require('mongoose');

class homeControllers {

    // 將商品3個分一組
    formateProduct = (products) => {
        const productArray = [];
        let i = 0;
        while (i < products.length) {
            let temp = [];
            let j = i;
            while (j < i + 3) {
                if (products[j]) {
                    temp.push(products[j]);
                }
                j++;
            }
            productArray.push([...temp]);
            i = j;
        }
        return productArray;
    }

    get_categorys = async (req, res) => {
        try {
            const categorys = await categoryModel.find({});
            responseReturn(res, 200, {
                categorys
            });

        } catch (error) {
            console.log(error.message);
        }
    }
    // end method

    get_products = async (req, res) => {

        try {
            const products = await productModel.find({}).limit(12).sort({
                createdAt: -1
            });

            // console.log(products)

            const allProduct1 = await productModel.find({}).limit(9).sort({
                createdAt: -1
            });
            const latest_product = this.formateProduct(allProduct1);

            const allProduct2 = await productModel.find({}).limit(9).sort({
                rating: -1
            });
            const topRated_product = this.formateProduct(allProduct2);

            const allProduct3 = await productModel.find({}).limit(9).sort({
                discount: -1
            });
            const discount_product = this.formateProduct(allProduct3);

            // console.log(latest_product)

            responseReturn(res, 200, {
                products,
                latest_product,
                topRated_product,
                discount_product
            });

        } catch (error) {
            console.log(error.message);
        }
    }
    // end method

    price_range_product = async (req, res) => {
        try {
            const priceRange = {
                low: 0,
                high: 0,
            }
            const products = await productModel.find({}).limit(9).sort({
                createdAt: -1 // 1 for asc -1 is for Desc
            })
            const latest_product = this.formateProduct(products);
            const getForPrice = await productModel.find({}).sort({
                'price': 1
            })
            if (getForPrice.length > 0) {
                priceRange.high = getForPrice[getForPrice.length - 1].price
                priceRange.low = getForPrice[0].price
            }
            responseReturn(res, 200, {
                latest_product,
                priceRange
            })

        } catch (error) {
            console.log(error.message)
        }
    }
    // end method

    query_products = async (req, res) => {
        const parPage = 12
        req.query.parPage = parPage
        try {
            const products = await productModel.find({}).sort({
                createdAt: -1
            })
            const totalProduct = new queryProducts(products, req.query).categoryQuery().ratingQuery().searchQuery().priceQuery().sortByPrice().countProducts();
            const result = new queryProducts(products, req.query).categoryQuery().ratingQuery().searchQuery().priceQuery().sortByPrice().limit().skip().getProducts();

            responseReturn(res, 200, {
                products: result,
                totalProduct,
                parPage
            })

        } catch (error) {
            console.log(error.message)
        }
    }
    // end method

    product_details = async (req, res) => {
        const { slug } = req.params // 從路徑參數提取 slug

        try {
            const product = await productModel.findOne({ slug })

            const relatedProducts = await productModel.find({
                $and: [{
                    _id: {
                        $ne: product.id
                    }
                },
                {
                    category: {
                        $eq: product.category
                    }
                }
                ]
            }).limit(12)
            const moreProducts = await productModel.find({
                $and: [{
                    _id: {
                        $ne: product.id
                    }
                },
                {
                    sellerId: {
                        $eq: product.sellerId
                    }
                }
                ]
            }).limit(3)
            responseReturn(res, 200, {
                product,
                relatedProducts,
                moreProducts
            })

        } catch (error) {
            console.log(error.message)
        }
    }
    // end method

    submit_review = async (req, res) => {
        const { productId, rating, review, name } = req.body
        console.log(req.body)
        try {
            await reviewModel.create({
                productId,
                name,
                rating,
                review,
                date: moment(Date.now()).format('LL')
            })
            let rat = 0;
            const reviews = await reviewModel.find({
                productId
            })
            for (let i = 0; i < reviews.length; i++) {
                rat = rat + reviews[i].rating
            }
            let productRating = 0
            if (reviews.length !== 0) {
                productRating = (rat / reviews.length).toFixed(1)
            }
            await productModel.findByIdAndUpdate(productId, {
                rating: productRating
            })
            responseReturn(res, 201, {
                message: "Review Added Successfully"
            })

        } catch (error) {
            console.log(error.message)
        }
    }
    // end method

    get_reviews = async (req, res) => {
        const { productId } = req.params // 路徑參數

        let { pageNo } = req.query // 查詢參數
        pageNo = parseInt(pageNo)
        const limit = 5
        const skipPage = limit * (pageNo - 1)

        try {
            // reviewModel 執行 aggregate
            let getRating = await reviewModel.aggregate([{
                $match: { // match 就取出來執行聚合
                    productId: {
                        $eq: new ObjectId(productId) // 特定的product id
                    },
                    rating: {
                        $not: { // 保留 rating 陣列 size 不為0的document
                            $size: 0
                        }
                    }
                }
            },
            {   // 將 rating 陣列拆解為單個評分值
                $unwind: "$rating"
            },
            {   // 以rating為基準, 計算每個rating值共有幾個
                $group: {
                    _id: "$rating",
                    count: {
                        $sum: 1
                    }
                }
            }
            ]) // aggregate result example : [ { _id: 5, count: 5 }, { _id: 4, count: 2 } ]
            let rating_review = [{
                rating: 5,
                sum: 0
            },
            {
                rating: 4,
                sum: 0
            },
            {
                rating: 3,
                sum: 0
            },
            {
                rating: 2,
                sum: 0
            },
            {
                rating: 1,
                sum: 0
            }
            ]
            for (let i = 0; i < rating_review.length; i++) {
                for (let j = 0; j < getRating.length; j++) {
                    if (rating_review[i].rating === getRating[j]._id) {
                        rating_review[i].sum = getRating[j].count
                        break
                    }
                }
            }
            const getAll = await reviewModel.find({
                productId
            })
            const reviews = await reviewModel.find({
                productId
            }).skip(skipPage).limit(limit).sort({ createdAt: -1 })
            responseReturn(res, 200, {
                reviews,
                totalReview: getAll.length,
                rating_review
            })

        } catch (error) {
            console.log(error.message)
        }
    }
    // end method
}
module.exports = new homeControllers();