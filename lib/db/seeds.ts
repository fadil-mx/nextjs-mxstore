import { cwd } from 'process'
import { connectDB } from '.'
import data from '../data'
import product from './models/productmodel'
import { loadEnvConfig } from '@next/env'
import User from './models/user.model'

loadEnvConfig(cwd())

const main = async () => {
  try {
    // const products = data.products
    const user = data.users
    await connectDB(process.env.MONGO_URL)
    // await product.deleteMany()
    // const createdProducts = await product.insertMany(products)

    await User.deleteMany()
    const createdUsers = await User.insertMany(user)
    console.log(createdUsers, 'seeded database successfully')
    // console.log(createdProducts, 'seeded database successfully')
    process.exit(0)
  } catch (error) {
    console.error('error seeding database:', error)
    throw new Error('error seeding database')
  }
}
main()
