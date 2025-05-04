import { cwd } from 'process'
import { connectDB } from '.'
import data from '../data'
// import product from './models/productmodel'
import { loadEnvConfig } from '@next/env'
// import User from './models/user.model'
// import Review from './models/reviewmodel'
import Carouselmodel from './models/carouselmodel'

loadEnvConfig(cwd())

const main = async () => {
  try {
    const carousel = data.carousels
    // const products = data.products
    // const user = data.users
    await connectDB(process.env.MONGO_URL)
    // await CarouselModel.deleteMany()
    const createdCarousels = await Carouselmodel.insertMany(carousel)
    console.log(createdCarousels, 'seeded database successfully')
    // await product.deleteMany()
    // const createdProducts = await product.insertMany(products)

    // await User.deleteMany()
    // const createdUsers = await User.insertMany(user)
    // console.log(createdUsers, 'seeded database successfully')
    // console.log(createdProducts, 'seeded database successfully')

    // await Review.deleteMany()
    // const rws = []
    // for (let i = 0; i < createdProducts.length; i++) {
    //   let x = 0
    //   const { ratingDistribution } = createdProducts[i]
    //   for (let j = 0; j < ratingDistribution.length; j++) {
    //     for (let k = 0; k < ratingDistribution[j].count; k++) {
    //       x++
    //       rws.push({
    //         ...data.reviews.filter((x) => x.rating === j + 1)[
    //           x % data.reviews.filter((x) => x.rating === j + 1).length
    //         ],
    //         isVerifiedPurchase: true,
    //         product: createdProducts[i]._id,
    //         user: createdUsers[x % createdUsers.length]._id,
    //         updatedAt: Date.now(),
    //         createdAt: Date.now(),
    //       })
    //     }
    //   }
    // }
    // const createdReviews = await Review.insertMany(rws)
    // console.log(createdReviews, 'seeded database successfully')

    process.exit(0)
  } catch (error) {
    console.error('error seeding database:', error)
    throw new Error('error seeding database')
  }
}
main()
